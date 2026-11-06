import { execFileSync } from 'node:child_process';
import { cp, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const revision = 'da949ad0952cf5d2b05e2777803aae3aa615ffbb';
const version = '2.0.17';
const client = process.argv.includes('--client');
const patch = fileURLToPath(new URL('./client.patch', import.meta.url));
const clientDist = new URL('./client/dist/twikoo.min.js', import.meta.url);
if (client) {
  try {
    const output = await stat(clientDist);
    const inputs = await Promise.all([fileURLToPath(import.meta.url), patch].map(path => stat(path)));
    if (inputs.every(input => input.mtimeMs <= output.mtimeMs)) process.exit(0);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}
const workspace = await mkdtemp(join(tmpdir(), 'asaki-twikoo-'));
const env = {
  ...process.env,
  npm_config_manage_package_manager_versions: 'false',
  npm_config_package_manager_strict: 'false',
  MONGOMS_DISABLE_POSTINSTALL: '1',
};
function run(command, args) {
  execFileSync(command, args, { cwd: workspace, env, stdio: 'inherit' });
}
try {
  run('git', ['init', '--quiet']);
  run('git', ['remote', 'add', 'origin', 'https://github.com/twikoojs/twikoo.git']);
  run('git', ['fetch', '--depth', '1', 'origin', revision]);
  run('git', ['checkout', '--detach', 'FETCH_HEAD']);
  if (client) run('git', ['apply', patch]);
  // Upstream release builds inject the client version through the shared package.
  const manifestPath = join(workspace, 'packages/shared/package.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  manifest.version = version;
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  run('pnpm', ['install', '--frozen-lockfile']);
  run('pnpm', ['-r', '--filter', client ? 'twikoo...' : '@twikoojs/cloudflare...', 'build']);
  if (client) {
    await cp(join(workspace, 'packages/client/dist/twikoo.min.js'), clientDist, { recursive: true });
  } else {
    const dist = new URL('./dist/', import.meta.url);
    await rm(dist, { recursive: true, force: true });
    await cp(join(workspace, 'packages/server-cloudflare/dist'), dist, { recursive: true });
    await cp(join(workspace, 'packages/server-cloudflare/schema.sql'), new URL('./dist/schema.sql', import.meta.url));
  }
} finally {
  await rm(workspace, { recursive: true, force: true });
}

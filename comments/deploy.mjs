import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const configPath = fileURLToPath(new URL('./wrangler.jsonc', import.meta.url));
const config = JSON.parse(await readFile(configPath, 'utf8'));
const staging = await mkdtemp(join(tmpdir(), 'asaki-twikoo-upload-'));
const wrangler = join(root, 'node_modules/.bin/wrangler');
let token;
function run(command, args, inherit = false) {
  const result = spawnSync(command, args, { cwd: root, encoding: 'utf8', stdio: inherit ? 'inherit' : 'pipe', timeout: 1250000 });
  if (result.error || result.status !== 0) {
    if (result.stderr) console.error(result.stderr);
    throw new Error(`${command === 'curl' ? 'Cloudflare upload' : 'Wrangler'} failed (exit ${result.status ?? 'unknown'})`);
  }
  return result.stdout;
}
function request(path, method, { data, forms } = {}) {
  // curl has no five-minute response-header deadline while uploading this bundle.
  const args = ['--http1.1', '--silent', '--show-error', '--connect-timeout', '30', '--max-time', '1200', '--request', method, '--header', `Authorization: Bearer ${token}`, '--header', 'User-Agent: wrangler/4.156.0'];
  if (data) args.push('--header', 'Content-Type: application/json', '--data-binary', JSON.stringify(data));
  for (const form of forms ?? []) args.push('--form', form);
  args.push(`https://api.cloudflare.com/client/v4/${path}`);
  const response = JSON.parse(run('curl', args));
  if (!response.success) throw new Error(`Cloudflare API rejected request: ${JSON.stringify(response.errors)}`);
  return response.result;
}
try {
  run(wrangler, ['deploy', '--config', configPath, '--dry-run', '--outdir', staging], true);
  token = JSON.parse(run(wrangler, ['auth', 'token', '--json'])).token;
  const script = `accounts/${config.account_id}/workers/scripts/${config.name}`;
  const metadata = {
    main_module: 'index.js',
    compatibility_date: config.compatibility_date,
    compatibility_flags: config.compatibility_flags,
    bindings: config.d1_databases.map(db => ({ type: 'd1', name: db.binding, id: db.database_id })),
  };
  const uploaded = request(script, 'PUT', { forms: [`metadata=${JSON.stringify(metadata)};type=application/json`, `index.js=@${join(staging, 'index.js')};type=application/javascript+module`] });
  request(`${script}/subdomain`, 'POST', { data: { enabled: config.workers_dev, previews_enabled: config.preview_urls } });
  for (const route of config.routes) {
    if (!route.custom_domain) throw new Error('This deploy command requires custom-domain routes');
    request(`accounts/${config.account_id}/workers/domains`, 'PUT', { data: { hostname: route.pattern, service: config.name, enabled: true, previews_enabled: false } });
  }
  console.log(JSON.stringify({ worker: config.name, deployment_id: uploaded.deployment_id, domains: config.routes.map(route => route.pattern) }));
} finally {
  token = undefined;
  await rm(staging, { recursive: true, force: true });
}

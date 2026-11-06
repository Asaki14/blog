export const SERIES = ['Dotfiles', 'Agent', '观后'] as const;

const titles: Record<string, { zh: string; en: string }> = {
  Dotfiles: { zh: '配置', en: 'Dotfiles' },
  Agent: { zh: 'AI', en: 'Agent' },
  观后: { zh: '观后', en: 'Reviews' },
};

export const seriesTitle = (name: string, lang: 'zh' | 'en') => titles[name][lang];

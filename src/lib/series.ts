export const SERIES = ['Dotfiles', 'Agent', '观后'] as const;

const titles: Record<string, { zh: string; en: string }> = {
  Dotfiles: { zh: 'Dotfiles', en: 'Dotfiles' },
  Agent: { zh: 'Agent', en: 'Agent' },
  观后: { zh: '观后', en: 'Reviews' },
};

export const seriesTitle = (name: string, lang: 'zh' | 'en') => titles[name][lang];

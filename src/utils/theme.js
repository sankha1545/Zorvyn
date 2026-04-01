// Theme-aware class utilities
// These provide dark/light variants for common patterns

export const theme = {
  // Backgrounds
  bg: {
    page: 'bg-zinc-950 dark:bg-zinc-950 light:bg-gray-50',
    surface: 'bg-zinc-900/80 dark:bg-zinc-900/80',
    surfaceHover: 'hover:bg-white/[0.04] dark:hover:bg-white/[0.04]',
    input: 'bg-white/[0.04] dark:bg-white/[0.04]',
    sidebar: 'bg-zinc-950 dark:bg-zinc-950',
    topbar: 'bg-zinc-950/80 dark:bg-zinc-950/80',
  },
  // Text
  text: {
    primary: 'text-zinc-100 dark:text-zinc-100',
    secondary: 'text-zinc-400 dark:text-zinc-400',
    muted: 'text-zinc-500 dark:text-zinc-500',
    dimmed: 'text-zinc-600 dark:text-zinc-600',
  },
  // Borders
  border: {
    subtle: 'border-white/[0.06] dark:border-white/[0.06]',
    input: 'border-white/[0.08] dark:border-white/[0.08]',
  },
};

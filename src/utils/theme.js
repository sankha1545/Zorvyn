// Theme-aware class utilities using CSS variables
// Supports both dark and light modes

export const theme = {
  // Backgrounds using CSS variables
  bg: {
    page: '[background-color:var(--bg-page)]',
    surface: '[background-color:var(--bg-surface)]',
    surfaceHover: 'hover:[background-color:var(--bg-surface-hover)]',
    surfaceHoverBg: '[background-color:var(--bg-surface-hover)]',
    input: '[background-color:var(--bg-input)]',
    sidebar: '[background-color:var(--bg-sidebar)]',
    topbar: '[background-color:var(--bg-topbar)]',
  },
  // Text colors using CSS variables
  text: {
    primary: '[color:var(--text-primary)]',
    secondary: '[color:var(--text-secondary)]',
    muted: '[color:var(--text-muted)]',
    dimmed: '[color:var(--text-dimmed)]',
    inverse: '[color:var(--text-inverse)]',
  },
  // Borders using CSS variables
  border: {
    subtle: '[border-color:var(--border-subtle)]',
    input: '[border-color:var(--border-input)]',
  },
};

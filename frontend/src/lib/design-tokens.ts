/**
 * Design Token System — Hezekiah Olawale Portfolio
 * Custom brand identity rooted in Nigerian tech excellence
 * Supports light/dark modes with semantic color aliases
 */

export const designTokens = {
  // ══════════════════════════════════════════════════════════════
  // COLOR PALETTE — Custom Brand Identity
  // ══════════════════════════════════════════════════════════════
  colors: {
    // Brand Core
    brand: {
      // Deep Indigo — Trust, depth, technical mastery
      primary: {
        50: '#EEF2FF',
        100: '#E0E7FF',
        200: '#C7D2FE',
        300: '#A5B4FC',
        400: '#818CF8',
        500: '#6366F1',
        600: '#4F46E5',
        700: '#4338CA',
        800: '#3730A3',
        900: '#312E81',
        950: '#1E1B4B',
        DEFAULT: '#4338CA',  // Primary brand color
        foreground: '#FFFFFF',
      },
      // Amber/Gold — Energy, Lagos sunset, achievement
      accent: {
        50: '#FFFAEB',
        100: '#FEF3C7',
        200: '#FDE68A',
        300: '#FCD34D',
        400: '#FBBF24',
        500: '#F59E0B',
        600: '#D97706',
        700: '#B45309',
        800: '#92400E',
        900: '#78350F',
        950: '#451A03',
        DEFAULT: '#F59E0B',  // Accent brand color
        foreground: '#1C1917',
      },
      // Cyan — Technical precision, innovation, clarity
      highlight: {
        50: '#ECFEFF',
        100: '#CFFAFE',
        200: '#A5F3FC',
        300: '#67E8F9',
        400: '#22D3EE',
        500: '#06B6D4',
        600: '#0891B2',
        700: '#0E7490',
        800: '#155E75',
        900: '#164E63',
        950: '#083344',
        DEFAULT: '#22D3EE',  // Highlight brand color
        foreground: '#164E63',
      },
    },

    // Semantic Surface Colors (auto-adapt to light/dark)
    surface: {
      // Base canvas
      canvas: {
        light: '#FFFFFF',
        dark: '#020617',      // Slate-950
      },
      // Card/container backgrounds
      elevated: {
        light: '#FAFAFA',     // Slate-50
        dark: '#0F172A',      // Slate-900
      },
      // Subtle backgrounds (sections, hover states)
      subtle: {
        light: '#F1F5F9',     // Slate-100
        dark: '#1E293B',      // Slate-800
      },
      // Interactive element backgrounds
      interactive: {
        light: '#F8FAFC',     // Slate-50
        dark: '#1E293B',      // Slate-800
      },
    },

    // Semantic Border Colors
    border: {
      DEFAULT: {
        light: '#E2E8F0',     // Slate-200
        dark: '#334155',      // Slate-700
      },
      muted: {
        light: '#F1F5F9',     // Slate-100
        dark: '#1E293B',      // Slate-800
      },
      emphasis: {
        light: '#CBD5E1',     // Slate-300
        dark: '#475569',      // Slate-600
      },
      brand: {
        light: '#A5B4FC',     // Indigo-300
        dark: '#6366F1',      // Indigo-500
      },
    },

    // Semantic Text Colors
    text: {
      primary: {
        light: '#0F172A',     // Slate-900
        dark: '#F8FAFC',      // Slate-50
      },
      secondary: {
        light: '#334155',     // Slate-700
        dark: '#CBD5E1',      // Slate-300
      },
      muted: {
        light: '#64748B',     // Slate-500
        dark: '#94A3B8',      // Slate-400
      },
      inverse: {
        light: '#FFFFFF',
        dark: '#020617',
      },
      brand: {
        light: '#4338CA',     // Indigo-700
        dark: '#A5B4FC',      // Indigo-300
      },
      accent: {
        light: '#B45309',     // Amber-700
        dark: '#FDE68A',      // Amber-200
      },
      highlight: {
        light: '#0E7490',     // Cyan-700
        dark: '#67E8F9',      // Cyan-300
      },
      success: {
        light: '#166534',     // Green-800
        dark: '#86EFAC',      // Green-300
      },
      warning: {
        light: '#9A3412',     // Orange-800
        dark: '#FDBA74',      // Orange-300
      },
      danger: {
        light: '#991B1B',     // Red-800
        dark: '#FCA5A5',      // Red-300
      },
    },

    // Status/Feedback Colors (consistent across themes)
    status: {
      success: {
        bg: { light: '#F0FDF4', dark: '#14532D' },
        border: { light: '#BBF7D0', dark: '#166534' },
        text: { light: '#166534', dark: '#86EFAC' },
        icon: { light: '#22C55E', dark: '#4ADE80' },
      },
      warning: {
        bg: { light: '#FFF7ED', dark: '#7C2D12' },
        border: { light: '#FFEDD5', dark: '#9A3412' },
        text: { light: '#9A3412', dark: '#FDBA74' },
        icon: { light: '#F97316', dark: '#FB923C' },
      },
      danger: {
        bg: { light: '#FEF2F2', dark: '#7F1D1D' },
        border: { light: '#FECACA', dark: '#991B1B' },
        text: { light: '#991B1B', dark: '#FCA5A5' },
        icon: { light: '#EF4444', dark: '#F87171' },
      },
      info: {
        bg: { light: '#EFF6FF', dark: '#1E3A8A' },
        border: { light: '#BFDBFE', dark: '#3B82F6' },
        text: { light: '#1E40AF', dark: '#93C5FD' },
        icon: { light: '#3B82F6', dark: '#60A5FA' },
      },
    },

    // Overlay/Scrim
    overlay: {
      light: 'rgba(15, 23, 42, 0.5)',   // Slate-900/50
      dark: 'rgba(2, 6, 23, 0.7)',      // Slate-950/70
    },
  },

  // ══════════════════════════════════════════════════════════════
  // TYPOGRAPHY
  // ══════════════════════════════════════════════════════════════
  typography: {
    fontFamilies: {
      sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      mono: ['var(--font-jetbrains-mono)', 'monospace'],
      display: ['var(--font-cal)', 'system-ui', 'sans-serif'], // For headlines
    },
    fontSizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
      '7xl': '4.5rem',   // 72px
    },
    fontWeights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    lineHeights: {
      tight: '1.1',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },

  // ══════════════════════════════════════════════════════════════
  // SPACING (4px base unit)
  // ══════════════════════════════════════════════════════════════
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    7: '1.75rem',   // 28px
    8: '2rem',      // 32px
    9: '2.25rem',   // 36px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    14: '3.5rem',   // 56px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    28: '7rem',     // 112px
    32: '8rem',     // 128px
  },

  // ══════════════════════════════════════════════════════════════
  // BORDER RADIUS
  // ══════════════════════════════════════════════════════════════
  borderRadius: {
    none: '0',
    sm: '0.25rem',    // 4px
    DEFAULT: '0.5rem', // 8px
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.75rem', // 28px
    full: '9999px',
  },

  // ══════════════════════════════════════════════════════════════
  // SHADOWS (Layered depth system)
  // ══════════════════════════════════════════════════════════════
  shadows: {
    // Subtle — for cards, inputs
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.03)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)',
    // Medium — for dropdowns, modals
    DEFAULT: '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)',
    md: '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)',
    // Large — for elevated cards, sheets
    lg: '0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.08)',
    xl: '0 25px 50px -12px rgb(0 0 0 / 0.12)',
    // Brand-colored glows
    brand: {
      sm: '0 0 0 1px rgb(67 56 202 / 0.1), 0 1px 3px 0 rgb(67 56 202 / 0.08)',
      DEFAULT: '0 0 0 1px rgb(67 56 202 / 0.15), 0 4px 12px -2px rgb(67 56 202 / 0.15)',
      lg: '0 0 0 1px rgb(67 56 202 / 0.2), 0 20px 40px -10px rgb(67 56 202 / 0.25)',
    },
    accent: {
      DEFAULT: '0 0 0 1px rgb(245 158 11 / 0.15), 0 4px 12px -2px rgb(245 158 11 / 0.15)',
    },
    highlight: {
      DEFAULT: '0 0 0 1px rgb(34 211 238 / 0.15), 0 4px 12px -2px rgb(34 211 238 / 0.15)',
    },
    // Inner shadows
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    innerBrand: 'inset 0 0 0 1px rgb(67 56 202 / 0.1)',
  },

  // ══════════════════════════════════════════════════════════════
  // TRANSITIONS
  // ══════════════════════════════════════════════════════════════
  transitions: {
    durations: {
      instant: '0ms',
      fast: '150ms',
      DEFAULT: '200ms',
      normal: '250ms',
      slow: '350ms',
      slower: '500ms',
    },
    easings: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      // Spring-like for delightful interactions
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      springGentle: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  },

  // ══════════════════════════════════════════════════════════════
  // Z-INDEX SCALE
  // ══════════════════════════════════════════════════════════════
  zIndex: {
    base: 0,
    dropdown: 100,
    sticky: 200,
    fixed: 300,
    modalBackdrop: 400,
    modal: 500,
    popover: 600,
    tooltip: 700,
    toast: 800,
    max: 9999,
  },

  // ══════════════════════════════════════════════════════════════
  // BREAKPOINTS
  // ══════════════════════════════════════════════════════════════
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // ══════════════════════════════════════════════════════════════
  // CONTAINER WIDTHS
  // ══════════════════════════════════════════════════════════════
  containers: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1400px',
    full: '100%',
  },

  // ══════════════════════════════════════════════════════════════
  // MOTION REDUCED PREFERENCES
  // ══════════════════════════════════════════════════════════════
  motion: {
    reduce: {
      durations: {
        instant: '0ms',
        fast: '0ms',
        DEFAULT: '0ms',
        normal: '0ms',
        slow: '0ms',
        slower: '0ms',
      },
    },
  },
} as const;

// Type exports for TypeScript consumers
export type DesignTokens = typeof designTokens;
export type ColorScale = typeof designTokens.colors.brand.primary;
export type SemanticColor = typeof designTokens.colors.text.primary;
export type SpacingValue = keyof typeof designTokens.spacing;
export type FontSizeValue = keyof typeof designTokens.typography.fontSizes;
export type BorderRadiusValue = keyof typeof designTokens.borderRadius;
export type ShadowValue = keyof typeof designTokens.shadows;
export type TransitionDuration = keyof typeof designTokens.transitions.durations;
export type ZIndexValue = keyof typeof designTokens.zIndex;

// ══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ══════════════════════════════════════════════════════════════

/** Get a color value for the current theme (light/dark) */
export function getColor(token: { light: string; dark: string }, theme: 'light' | 'dark' = 'light'): string {
  return theme === 'dark' ? token.dark : token.light;
}

/** Generate CSS custom properties from design tokens */
export function generateCSSVariables(theme: 'light' | 'dark' = 'light'): Record<string, string> {
  const vars: Record<string, string> = {};
  const t = designTokens;

  // Colors
  Object.entries(t.colors.brand).forEach(([scale, values]) => {
    if (typeof values === 'object' && 'DEFAULT' in values) {
      Object.entries(values).forEach(([shade, value]) => {
        if (typeof value === 'string') {
          vars[`--color-brand-${scale}-${shade}`] = value;
        }
      });
    }
  });

  // Semantic colors
  Object.entries(t.colors.surface).forEach(([key, value]) => {
    vars[`--color-surface-${key}`] = getColor(value, theme);
  });
  Object.entries(t.colors.border).forEach(([key, value]) => {
    vars[`--color-border-${key}`] = getColor(value, theme);
  });
  Object.entries(t.colors.text).forEach(([key, value]) => {
    vars[`--color-text-${key}`] = getColor(value, theme);
  });
  Object.entries(t.colors.status).forEach(([status, colors]) => {
    Object.entries(colors).forEach(([role, value]) => {
      vars[`--color-status-${status}-${role}`] = getColor(value, theme);
    });
  });
  vars['--color-overlay'] = getColor(t.colors.overlay, theme);

  // Spacing
  Object.entries(t.spacing).forEach(([key, value]) => {
    vars[`--spacing-${key}`] = value;
  });

  // Typography
  Object.entries(t.typography.fontSizes).forEach(([key, value]) => {
    vars[`--font-size-${key}`] = value;
  });
  Object.entries(t.typography.fontWeights).forEach(([key, value]) => {
    vars[`--font-weight-${key}`] = value;
  });
  Object.entries(t.typography.lineHeights).forEach(([key, value]) => {
    vars[`--line-height-${key}`] = value;
  });
  Object.entries(t.typography.letterSpacing).forEach(([key, value]) => {
    vars[`--letter-spacing-${key}`] = value;
  });

  // Border radius
  Object.entries(t.borderRadius).forEach(([key, value]) => {
    vars[`--radius-${key}`] = value;
  });

  // Shadows
  Object.entries(t.shadows).forEach(([key, value]) => {
    if (typeof value === 'string') {
      vars[`--shadow-${key}`] = value;
    } else {
      Object.entries(value).forEach(([subKey, subValue]) => {
        vars[`--shadow-${key}-${subKey}`] = subValue;
      });
    }
  });

  // Transitions
  Object.entries(t.transitions.durations).forEach(([key, value]) => {
    vars[`--duration-${key}`] = value;
  });
  Object.entries(t.transitions.easings).forEach(([key, value]) => {
    vars[`--easing-${key}`] = value;
  });

  // Z-index
  Object.entries(t.zIndex).forEach(([key, value]) => {
    vars[`--z-${key}`] = String(value);
  });

  return vars;
}

// Default export for convenience
export default designTokens;
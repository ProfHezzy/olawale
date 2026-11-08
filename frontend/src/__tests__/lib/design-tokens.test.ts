import { designTokens } from '@/lib/design-tokens';

describe('Design Tokens', () => {
  describe('Colors', () => {
    it('has brand primary colors defined', () => {
      expect(designTokens.colors.brand.primary).toBeDefined();
      expect(designTokens.colors.brand.primary['700']).toBe('#4338CA');
      expect(designTokens.colors.brand.primary.foreground).toBe('#FFFFFF');
    });

    it('has brand highlight colors defined', () => {
      expect(designTokens.colors.brand.highlight).toBeDefined();
      expect(designTokens.colors.brand.highlight['500']).toBe('#06B6D4');
    });

    it('has brand accent colors defined', () => {
      expect(designTokens.colors.brand.accent).toBeDefined();
      expect(designTokens.colors.brand.accent['500']).toBe('#F59E0B');
    });

    it('has surface colors', () => {
      expect(designTokens.colors.surface.canvas).toBeDefined();
      expect(designTokens.colors.surface.canvas.light).toBe('#FFFFFF');
      expect(designTokens.colors.surface.canvas.dark).toBe('#020617');
    });

    it('has status colors', () => {
      expect(designTokens.colors.status.success).toBeDefined();
      expect(designTokens.colors.status.warning).toBeDefined();
      expect(designTokens.colors.status.danger).toBeDefined();
      expect(designTokens.colors.status.info).toBeDefined();
    });
  });

  describe('Typography', () => {
    it('has font families defined', () => {
      expect(designTokens.typography.fontFamilies.sans).toBeDefined();
      expect(designTokens.typography.fontFamilies.display).toBeDefined();
      expect(designTokens.typography.fontFamilies.mono).toBeDefined();
    });

    it('has font sizes defined', () => {
      expect(designTokens.typography.fontSizes.xs).toBe('0.75rem');
      expect(designTokens.typography.fontSizes.sm).toBe('0.875rem');
      expect(designTokens.typography.fontSizes.base).toBe('1rem');
      expect(designTokens.typography.fontSizes.lg).toBe('1.125rem');
      expect(designTokens.typography.fontSizes.xl).toBe('1.25rem');
      expect(designTokens.typography.fontSizes['2xl']).toBe('1.5rem');
      expect(designTokens.typography.fontSizes['3xl']).toBe('1.875rem');
      expect(designTokens.typography.fontSizes['4xl']).toBe('2.25rem');
      expect(designTokens.typography.fontSizes['5xl']).toBe('3rem');
      expect(designTokens.typography.fontSizes['6xl']).toBe('3.75rem');
    });

    it('has font weights', () => {
      expect(designTokens.typography.fontWeights.normal).toBe('400');
      expect(designTokens.typography.fontWeights.medium).toBe('500');
      expect(designTokens.typography.fontWeights.semibold).toBe('600');
      expect(designTokens.typography.fontWeights.bold).toBe('700');
      expect(designTokens.typography.fontWeights.extrabold).toBe('800');
    });

    it('has letter spacing', () => {
      expect(designTokens.typography.letterSpacing.tight).toBeDefined();
      expect(designTokens.typography.letterSpacing.normal).toBeDefined();
      expect(designTokens.typography.letterSpacing.wide).toBeDefined();
      expect(designTokens.typography.letterSpacing.widest).toBeDefined();
    });
  });

  describe('Spacing', () => {
    it('has consistent spacing scale', () => {
      expect(designTokens.spacing[0]).toBe('0');
      expect(designTokens.spacing[1]).toBe('0.25rem');
      expect(designTokens.spacing[2]).toBe('0.5rem');
      expect(designTokens.spacing[4]).toBe('1rem');
      expect(designTokens.spacing[8]).toBe('2rem');
      expect(designTokens.spacing[16]).toBe('4rem');
    });
  });

  describe('Border Radius', () => {
    it('has radius scale', () => {
      expect(designTokens.borderRadius.none).toBe('0');
      expect(designTokens.borderRadius.sm).toBe('0.25rem');
      expect(designTokens.borderRadius.DEFAULT).toBe('0.5rem');
      expect(designTokens.borderRadius.md).toBe('0.75rem');
      expect(designTokens.borderRadius.lg).toBe('1rem');
      expect(designTokens.borderRadius.xl).toBe('1.25rem');
      expect(designTokens.borderRadius['2xl']).toBe('1.5rem');
      expect(designTokens.borderRadius.full).toBe('9999px');
    });
  });

  describe('Shadows', () => {
    it('has elevation shadows', () => {
      expect(designTokens.shadows.xs).toBeDefined();
      expect(designTokens.shadows.sm).toBeDefined();
      expect(designTokens.shadows.DEFAULT).toBeDefined();
      expect(designTokens.shadows.md).toBeDefined();
      expect(designTokens.shadows.lg).toBeDefined();
      expect(designTokens.shadows.xl).toBeDefined();
      expect(designTokens.shadows.inner).toBeDefined();
    });
  });

  describe('Transitions', () => {
    it('has transition durations', () => {
      expect(designTokens.transitions.durations.instant).toBe('0ms');
      expect(designTokens.transitions.durations.fast).toBe('150ms');
      expect(designTokens.transitions.durations.DEFAULT).toBe('200ms');
      expect(designTokens.transitions.durations.normal).toBe('250ms');
      expect(designTokens.transitions.durations.slow).toBe('350ms');
      expect(designTokens.transitions.durations.slower).toBe('500ms');
    });

    it('has easing functions', () => {
      expect(designTokens.transitions.easings.linear).toBeDefined();
      expect(designTokens.transitions.easings.in).toBeDefined();
      expect(designTokens.transitions.easings.out).toBeDefined();
      expect(designTokens.transitions.easings.inOut).toBeDefined();
      expect(designTokens.transitions.easings.spring).toBeDefined();
    });
  });

  describe('Z-Index', () => {
    it('has consistent z-index scale', () => {
      expect(designTokens.zIndex.base).toBe(0);
      expect(designTokens.zIndex.dropdown).toBe(100);
      expect(designTokens.zIndex.sticky).toBe(200);
      expect(designTokens.zIndex.fixed).toBe(300);
      expect(designTokens.zIndex.modalBackdrop).toBe(400);
      expect(designTokens.zIndex.modal).toBe(500);
      expect(designTokens.zIndex.popover).toBe(600);
      expect(designTokens.zIndex.tooltip).toBe(700);
      expect(designTokens.zIndex.toast).toBe(800);
    });
  });

  describe('Breakpoints', () => {
    it('has responsive breakpoints', () => {
      expect(designTokens.breakpoints.sm).toBe('640px');
      expect(designTokens.breakpoints.md).toBe('768px');
      expect(designTokens.breakpoints.lg).toBe('1024px');
      expect(designTokens.breakpoints.xl).toBe('1280px');
      expect(designTokens.breakpoints['2xl']).toBe('1536px');
    });
  });
});
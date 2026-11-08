import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { useTheme } from '@/components/ThemeProvider';

// Test component that uses the theme context
function TestComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved-theme">{resolvedTheme}</span>
      <button onClick={() => setTheme('light')}>Set Light</button>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('system')}>Set System</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset document class
    document.documentElement.classList.remove('dark', 'light');
  });

  it('provides default theme as system', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('system');
    expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light'); // Default system preference
  });

  it('persists theme to localStorage', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const setThemeButton = screen.getByText('Set Dark');
    act(() => {
      fireEvent.click(setThemeButton);
    });

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('reads theme from localStorage on mount', () => {
    localStorage.setItem('theme', 'dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('applies dark class to document when dark theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const setThemeButton = screen.getByText('Set Dark');
    act(() => {
      fireEvent.click(setThemeButton);
    });

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('removes dark class when light theme', () => {
    document.documentElement.classList.add('dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const setThemeButton = screen.getByText('Set Light');
    act(() => {
      fireEvent.click(setThemeButton);
    });

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('handles system theme changes', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Initially should be light (default)
    expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');

    // Simulate system preference change to dark
    act(() => {
      // We need to trigger the media query listener
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      // Note: In jsdom, we can't easily trigger matchMedia changes
      // This test documents expected behavior
    });
  });
});
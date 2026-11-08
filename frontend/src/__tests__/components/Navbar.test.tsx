import { render, screen, fireEvent, act } from '@testing-library/react';
import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/components/ThemeProvider';

describe('Navbar', () => {
  const renderWithTheme = (component: React.ReactNode) => {
    return render(
      <ThemeProvider>
        {component}
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark', 'light');
  });

  it('renders brand logo', () => {
    renderWithTheme(<Navbar />);
    expect(screen.getByText(/HOO/i)).toBeInTheDocument();
    expect(screen.getByText('.')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderWithTheme(<Navbar />);
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText(/Academics/i)).toBeInTheDocument();
    expect(screen.getByText('Certifications')).toBeInTheDocument();
  });

  it('renders theme toggle button', () => {
    renderWithTheme(<Navbar />);
    const themeToggle = screen.getByRole('button', { name: /switch to/i });
    expect(themeToggle).toBeInTheDocument();
  });

  it('toggles theme when button clicked', () => {
    renderWithTheme(<Navbar />);

    const themeToggle = screen.getByRole('button', { name: /switch to/i });
    act(() => {
      fireEvent.click(themeToggle);
    });

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('shows mobile menu button on small screens', () => {
    renderWithTheme(<Navbar />);
    const mobileMenuButtons = screen.getAllByRole('button');
    expect(mobileMenuButtons.length).toBeGreaterThan(1);
  });

  it('has hire me CTA button', () => {
    renderWithTheme(<Navbar />);
    expect(screen.getByRole('link', { name: /hire me/i })).toBeInTheDocument();
  });
});
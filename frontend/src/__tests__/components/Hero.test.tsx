/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
import { render, screen } from '@testing-library/react';
import Hero from '@/components/Hero';
import { ThemeProvider } from '@/components/ThemeProvider';

// Mock @tanstack/react-query
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  useQueryClient: () => ({
    invalidateQueries: jest.fn(),
    setQueryData: jest.fn(),
    getQueryData: jest.fn(),
  }),
  QueryClient: jest.fn(),
  QueryClientProvider: ({ children }: any) => <>{children}</>,
}));

const { useQuery } = require('@tanstack/react-query');

describe('Hero', () => {
  const renderWithTheme = (component: React.ReactNode) => {
    return render(
      <ThemeProvider>
        {component}
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useQuery as jest.Mock).mockReturnValue({
      data: {
        full_name: 'Hezekiah Olawale',
        bio: 'Bridging the gap between robust backend architecture and seamless frontend experiences through precision and passion.',
        years_experience: 5,
        projects_completed: 50,
      },
      isLoading: false,
      isError: false,
    });
  });

  it('renders hero section with profile data', () => {
    renderWithTheme(<Hero />);
    expect(screen.getByText('Hezekiah Olawale')).toBeInTheDocument();
  });

  it('displays badge text', () => {
    renderWithTheme(<Hero />);
    expect(screen.getByText(/Available for New Projects/i)).toBeInTheDocument();
  });

  it('has CTA buttons', () => {
    renderWithTheme(<Hero />);
    expect(screen.getByRole('link', { name: /hire.*me/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view projects/i })).toBeInTheDocument();
  });

  it('displays bio when profile data is provided', () => {
    renderWithTheme(<Hero />);
    expect(screen.getByText(/Bridging the gap/i)).toBeInTheDocument();
  });

  it('renders without profile data (fallback)', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    });
    renderWithTheme(<Hero />);
    expect(screen.getByText(/Web Systems/i)).toBeInTheDocument();
  });
});
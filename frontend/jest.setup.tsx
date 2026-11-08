/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill for Next.js 16
global.TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder as any;

// JSDOM polyfills
global.matchMedia = global.matchMedia || function() {
  return {
    matches: false,
    media: '',
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
};

global.requestAnimationFrame = ((callback: FrameRequestCallback) => {
  return setTimeout(callback, 0) as unknown as number;
}) as typeof requestAnimationFrame;

global.cancelAnimationFrame = ((id: number) => {
  clearTimeout(id);
}) as typeof cancelAnimationFrame;

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: function Image({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  },
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useAnimation: () => ({ start: jest.fn(), stop: jest.fn() }),
  useMotionValue: (initial: any) => ({ get: () => initial, set: jest.fn() }),
  useTransform: (value: any, transformer: any) => transformer(value),
}));

// Mock lucide-react
jest.mock('lucide-react', () => {
  const icons = [
    'Briefcase', 'BookOpen', 'Award', 'MessageSquare', 'TrendingUp',
    'ArrowRight', 'Plus', 'Loader2', 'CheckCircle', 'Clock', 'Bot',
    'Sparkles', 'Zap', 'Sun', 'Moon', 'Menu', 'X', 'Mail', 'User',
    'Globe', 'GraduationCap', 'Wrench', 'BarChart2', 'Settings',
    'LogOut', 'LayoutDashboard', 'ExternalLink', 'Star', 'Search',
    'Github', 'Heart', 'Share2', 'Calendar', 'Tag', 'Filter',
    'MapPin', 'Linkedin', 'Twitter', 'Send', 'Pencil', 'Trash2',
    'GitBranch', 'Link2', 'ArrowLeft'
  ];
  const mockIcons: Record<string, any> = {};
  icons.forEach(name => {
    mockIcons[name] = ({ ...props }: any) => <svg data-testid={name.toLowerCase()} {...props} />;
  });
  return mockIcons;
});

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
  Toaster: () => null,
}));

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

// Mock axios
jest.mock('axios', () => ({
  create: () => ({
    get: jest.fn().mockResolvedValue({ data: {} }),
    post: jest.fn().mockResolvedValue({ data: {} }),
    patch: jest.fn().mockResolvedValue({ data: {} }),
    delete: jest.fn().mockResolvedValue({ data: {} }),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  }),
}));

// Suppress console.error in tests (except for actual errors we want to see)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
        args[0].includes('act(...)') ||
        args[0].includes('An update to') ||
        args[0].includes('useLayoutEffect does nothing on the server'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
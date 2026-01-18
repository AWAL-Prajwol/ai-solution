import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

process.env.MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

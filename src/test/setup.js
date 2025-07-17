// Setup para testes
import { vi } from 'vitest';

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock do window.confirm
global.confirm = vi.fn(() => true);

// Mock do window.alert
global.alert = vi.fn();
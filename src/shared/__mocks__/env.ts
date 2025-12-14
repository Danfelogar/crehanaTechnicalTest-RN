// Mock de @env
jest.mock('@env', () => ({
  MMKV_ENCRYPTION_KEY: 'test-encryption-key',
  API_URL: 'https://test-api.com',
}));

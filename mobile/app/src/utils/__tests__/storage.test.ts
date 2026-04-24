import { secureStorage, SENSITIVE_KEYS } from '../storage';
import * as SecureStore from 'expo-secure-store';

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

describe('SecureStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call SecureStore.getItemAsync with correct key', async () => {
    const mockValue = 'secret-token';
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockValue);

    const result = await secureStorage.getItem('test-key');

    expect(SecureStore.getItemAsync).toHaveBeenCalledWith('test-key');
    expect(result).toBe(mockValue);
  });

  it('should call SecureStore.setItemAsync with correct key and value', async () => {
    await secureStorage.setItem('test-key', 'test-value');

    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('test-key', 'test-value');
  });

  it('should call SecureStore.deleteItemAsync with correct key', async () => {
    await secureStorage.removeItem('test-key');

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('test-key');
  });

  it('should clear all known sensitive keys', async () => {
    await secureStorage.clear();

    SENSITIVE_KEYS.forEach((key) => {
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(key);
    });
  });

  it('should handle errors gracefully in getItem', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(new Error('Storage error'));
    
    const result = await secureStorage.getItem('test-key');
    
    expect(result).toBeNull();
  });
});

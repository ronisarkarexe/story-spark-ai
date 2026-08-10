import { describe, it, expect, beforeEach } from 'vitest';
import { setToLocalStorage, getFromLocalStorage, removeFromLocalStorage } from '../local-storage';

describe('local-storage utility', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should set and get items from localStorage', () => {
    setToLocalStorage('test_key', 'test_value');
    expect(getFromLocalStorage('test_key')).toBe('test_value');
  });

  it('should remove items from localStorage', () => {
    setToLocalStorage('temp_key', 'temp_value');
    removeFromLocalStorage('temp_key');
    expect(getFromLocalStorage('temp_key')).toBeNull();
  });

  it('should return empty string for empty key', () => {
    expect(setToLocalStorage('', 'val')).toBe('');
    expect(getFromLocalStorage('')).toBe('');
    expect(removeFromLocalStorage('')).toBe('');
  });
});

import { describe, it, expect } from 'vitest';
import { checkNameConsistency } from '../nameConsistency';

describe('checkNameConsistency', () => {
  it('should return empty array for empty string', () => {
    const result = checkNameConsistency('');
    expect(result).toEqual([]);
  });

  it('should return empty array when no name issues are found', () => {
    const result = checkNameConsistency('John went to the store.');
    expect(result).toEqual([]);
  });

  it('should detect Jon and suggest John', () => {
    const result = checkNameConsistency('Jon went to the store.');
    expect(result).toHaveLength(1);
    expect(result[0].original).toBe('Jon');
    expect(result[0].suggestion).toBe('John');
  });

  it('should detect Kathrine and suggest Katherine', () => {
    const result = checkNameConsistency('Kathrine wrote a book.');
    expect(result).toHaveLength(1);
    expect(result[0].original).toBe('Kathrine');
    expect(result[0].suggestion).toBe('Katherine');
  });

  it('should detect Sara and suggest Sarah', () => {
    const result = checkNameConsistency('Sara smiled at him.');
    expect(result).toHaveLength(1);
    expect(result[0].original).toBe('Sara');
    expect(result[0].suggestion).toBe('Sarah');
  });

  it('should detect Micheal and suggest Michael', () => {
    const result = checkNameConsistency('Micheal was brave.');
    expect(result).toHaveLength(1);
    expect(result[0].original).toBe('Micheal');
    expect(result[0].suggestion).toBe('Michael');
  });

  it('should strip trailing punctuation before checking', () => {
    const result = checkNameConsistency('Hello, Jon!');
    expect(result).toHaveLength(1);
    expect(result[0].original).toBe('Jon');
  });

  it('should handle names at the start of a sentence', () => {
    const result = checkNameConsistency('Jon ran home.');
    expect(result).toHaveLength(1);
    expect(result[0].original).toBe('Jon');
  });

  it('should detect multiple name issues in one text', () => {
    const result = checkNameConsistency('Jon and Sara went to the park. Micheal was there too.');
    expect(result).toHaveLength(3);
  });

  it('should not flag correctly spelled names', () => {
    const result = checkNameConsistency('John Sarah Michael went to the park.');
    expect(result).toEqual([]);
  });

  it('should be case sensitive for known names', () => {
    const lower = checkNameConsistency('Jon ran home.');
    const upper = checkNameConsistency('JON ran home.');
    // The function uses exact match (word.replace(/[.,!?]/g, "")), case sensitive
    expect(upper).toHaveLength(0);
  });
});

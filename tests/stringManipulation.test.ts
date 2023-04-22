import { describe, it, expect } from '@jest/globals';
import { capitalizeFirstLetter } from '../utilities';

describe('capitalizeFirstLetter', () => {
  it('should return an empty string if the string is falsy', () => {
    expect(capitalizeFirstLetter('')).toBe('');
    expect(capitalizeFirstLetter(null)).toBe('');
    expect(capitalizeFirstLetter(undefined)).toBe('');
  });

  it('should return an empty string if the string is not a string', () => {
    expect(capitalizeFirstLetter(123)).toBe('');
    expect(capitalizeFirstLetter([])).toBe('');
    expect(capitalizeFirstLetter({})).toBe('');
  });

  it('should return a capitalized string if the input is a valid string', () => {
    expect(capitalizeFirstLetter('hello')).toBe('Hello');
    expect(capitalizeFirstLetter('HELLO')).toBe('HELLO');
  });
});

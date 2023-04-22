import { describe, it, expect } from '@jest/globals';
import { generateRandomKey } from '../utilities';

describe('generateRandomKey', () => {
  it('should generate a random string of the specified length', () => {
    const key = generateRandomKey(10);
    expect(key).toHaveLength(10);
  });

  it('should generate a string that only contains allowed characters', () => {
    const key = generateRandomKey(10);
    expect(key).toMatch(/^[a-zA-Z0-9]*$/);
  });

  it('should generate a different string each time it is called', () => {
    const key1 = generateRandomKey(10);
    const key2 = generateRandomKey(10);
    expect(key1).not.toEqual(key2);
  });
});

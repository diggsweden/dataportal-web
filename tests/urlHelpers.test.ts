import { describe, it, expect } from '@jest/globals';
import { linkBase, makeBreadcrumbsFromPath, SearchDatasetsPagePath, slugify } from '../utilities';

describe('slugify', () => {
  it('should replace spaces with dashes', () => {
    expect(slugify('this is a test')).toBe('this-is-a-test');
  });

  it('should replace special characters with their replacements', () => {
    expect(slugify('detta är en rubrik')).toBe('detta-ar-en-rubrik');
  });

  it('should replace & with and', () => {
    expect(slugify('test & test')).toBe('test-and-test');
  });

  it('should remove all non-word characters', () => {
    expect(slugify('test@test.com')).toBe('testtestcom');
  });

  it('should replace multiple dashes with a single dash', () => {
    expect(slugify('test--test')).toBe('test-test');
  });

  it('should trim dashes from the start and end of the string', () => {
    expect(slugify('-test-')).toBe('test');
  });

  it('should remove all non-word characters', () => {
    expect(slugify('remove # these !')).toEqual('remove-these');
  });

  it('should replace multiple dashes with a single dash', () => {
    expect(slugify('hello   world')).toEqual('hello-world');
  });

  it('should trim dashes from the start and end of the string', () => {
    expect(slugify('-hello world-')).toEqual('hello-world');
  });

  it('should convert uppercase characters to lowercase', () => {
    expect(slugify('HELLO WORLD')).toEqual('hello-world');
  });

  it('should handle numbers', () => {
    expect(slugify('hello 123 world 456')).toEqual('hello-123-world-456');
  });

  it('should handle empty strings', () => {
    expect(slugify('')).toEqual('');
  });

  it('should handle null and undefined values', () => {
    expect(slugify(null)).toEqual('');
    expect(slugify(undefined)).toEqual('');
  });
});

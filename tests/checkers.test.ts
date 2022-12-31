import { describe, it, expect } from '@jest/globals';
import { isExternalLink } from '../utilities';

// Define the tests
describe('isExternalLink', () => {
  it('should return true for external links', () => {
    // Test URLs that start with "http"
    expect(isExternalLink('http://example.com')).toBe(true);
    expect(isExternalLink('http://www.example.com')).toBe(true);

    // Test URLs that start with "https"
    expect(isExternalLink('https://example.com')).toBe(true);
    expect(isExternalLink('https://www.example.com')).toBe(true);

    // Test URLs that start with "www."
    expect(isExternalLink('www.example.com')).toBe(true);

    // Test mailto links
    expect(isExternalLink('mailto:test@example.com')).toBe(true);
  });

  it('should return false for internal links', () => {
    // Test relative URLs
    expect(isExternalLink('/path/to/page')).toBe(false);
    expect(isExternalLink('../path/to/page')).toBe(false);

    // Test root-relative URLs
    expect(isExternalLink('/')).toBe(false);
    expect(isExternalLink('/path')).toBe(false);

    // Test URLs that do not start with "http", "https", "www.", or "mailto:"
    expect(isExternalLink('other-protocol://example.com')).toBe(false);
    expect(isExternalLink('example.com')).toBe(false);
    expect(isExternalLink('/path/to/page#hash')).toBe(false);
  });
});

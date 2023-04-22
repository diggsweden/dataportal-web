import { describe, it, expect } from '@jest/globals';
import { getEntryLang, getLocalizedValue } from '../utilities';

describe('getLocalizedValue', () => {
  it('should return the correct localized value', () => {
    const metadataGraph = {
      find: (resourceURI, prop) => [
        { getLanguage: () => 'en', getValue: () => 'English' },
        { getLanguage: () => 'sv', getValue: () => 'Swedish' },
        { getLanguage: () => '', getValue: () => 'Default' },
      ],
    };

    expect(getLocalizedValue(metadataGraph, 'prop', 'en')).toEqual('English');
    expect(getLocalizedValue(metadataGraph, 'prop', 'sv')).toEqual('Swedish');
    expect(getLocalizedValue(metadataGraph, 'prop', 'fr')).toEqual('Swedish');
    expect(getLocalizedValue(metadataGraph, 'prop', '')).toEqual('Default');
  });

  it('should return an empty string if no statements are found', () => {
    const metadataGraph = {
      find: (resourceURI, prop) => [],
    };

    expect(getLocalizedValue(metadataGraph, 'prop', 'en')).toEqual('');
  });

  it('should handle missing options', () => {
    const metadataGraph = {
      find: (resourceURI, prop) => [{ getLanguage: () => 'en', getValue: () => 'English' }],
    };

    expect(getLocalizedValue(metadataGraph, 'prop', 'en')).toEqual('English');
  });
});

describe('getEntryLang', () => {
  it('should return the specified language if a value is available for it', () => {
    const metadataGraph = {
      find: () => [{ getLanguage: () => 'en', getValue: () => 'test' }],
    };
    expect(getEntryLang(metadataGraph, 'prop', 'en')).toEqual('en');
  });

  it('should return the fallback language if a value is not available for the specified language', () => {
    const metadataGraph = {
      find: () => [{ getLanguage: () => 'sv', getValue: () => 'test' }],
    };
    expect(getEntryLang(metadataGraph, 'prop', 'en')).toEqual('sv');
  });

  it('should return an empty string if no values are available for the specified language or fallback language', () => {
    const metadataGraph = {
      find: () => [],
    };
    expect(getEntryLang(metadataGraph, 'prop', 'en')).toEqual('');
  });
});

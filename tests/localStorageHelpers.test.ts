/**
 * @jest-environment jsdom
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { clearLocalStorage } from '../utilities';

describe('clearLocalStorage', () => {
  beforeEach(() => {
    // Set up some items in local storage for the tests
    localStorage.setItem('test_prefix_1', 'value1');
    localStorage.setItem('test_prefix_2', 'value2');
    localStorage.setItem('test_prefix_3', 'value3');
    localStorage.setItem('other_prefix_1', 'value4');
    localStorage.setItem('other_prefix_2', 'value5');
  });

  afterEach(() => {
    // Clear all items from local storage after each test
    localStorage.clear();
  });

  it('clears all items with a key that begins with the specified prefix', () => {
    clearLocalStorage('test_prefix_');
    expect(localStorage.length).toEqual(2);
    expect(localStorage.getItem('test_prefix_1')).toBeNull();
    expect(localStorage.getItem('test_prefix_2')).toBeNull();
    expect(localStorage.getItem('test_prefix_3')).toBeNull();
    expect(localStorage.getItem('other_prefix_1')).toEqual('value4');
    expect(localStorage.getItem('other_prefix_2')).toEqual('value5');
  });

  it('does not clear the item with the specified skip key', () => {
    clearLocalStorage('test_prefix_', 'test_prefix_2');
    expect(localStorage.length).toEqual(3);
    expect(localStorage.getItem('test_prefix_1')).toBeNull();
    expect(localStorage.getItem('test_prefix_2')).toEqual('value2');
    expect(localStorage.getItem('test_prefix_3')).toBeNull();
    expect(localStorage.getItem('other_prefix_1')).toEqual('value4');
    expect(localStorage.getItem('other_prefix_2')).toEqual('value5');
  });

  it('does not throw an error if the skip key is not found in local storage', () => {
    clearLocalStorage('test_prefix_', 'non_existent_key');
    expect(localStorage.length).toEqual(2);
    expect(localStorage.getItem('test_prefix_1')).toBeNull();
    expect(localStorage.getItem('test_prefix_2')).toBeNull();
    expect(localStorage.getItem('test_prefix_3')).toBeNull();
    expect(localStorage.getItem('other_prefix_1')).toEqual('value4');
    expect(localStorage.getItem('other_prefix_2')).toEqual('value5');
  });
});

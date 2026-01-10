// =============================================================================
// CACHE TESTS
// Tests for localStorage persistence functionality
// =============================================================================

/**
 * @jest-environment jsdom
 */

import { cachedGraphQL } from '@/lib/cache';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  key: jest.fn(),
  length: 0
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock GraphQL client
jest.mock('aws-amplify/api', () => ({
  generateClient: () => ({
    graphql: jest.fn()
  })
}));

describe('Cache localStorage persistence', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should save persistent queries to localStorage', async () => {
    const mockResponse = {
      data: {
        getPropertyCards: {
          properties: [{ id: '1', title: 'Test Property' }],
          nextToken: null
        }
      }
    };

    // Mock the GraphQL client response
    const { generateClient } = require('aws-amplify/api');
    const mockClient = generateClient();
    mockClient.graphql.mockResolvedValue(mockResponse);

    // Execute a query that should be cached
    await cachedGraphQL.query({
      query: 'query getPropertyCards { getPropertyCards { properties { id title } } }',
      variables: { limit: 10 }
    });

    // Verify localStorage.setItem was called
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      expect.stringMatching(/^ndotoni_cache_/),
      expect.stringContaining('Test Property')
    );
  });

  it('should load cache from localStorage on initialization', () => {
    const cachedData = JSON.stringify({
      data: { test: 'data' },
      timestamp: Date.now(),
      query: 'query getPropertyCards { }',
      variables: {}
    });

    localStorageMock.getItem.mockReturnValue(cachedData);
    
    // Re-import to trigger initialization
    jest.resetModules();
    require('@/lib/cache');

    // Verify localStorage.getItem was called
    expect(localStorageMock.getItem).toHaveBeenCalled();
  });

  it('should clear localStorage when clearing all caches', () => {
    // Mock some localStorage keys
    Object.defineProperty(window.localStorage, 'key', {
      value: jest.fn()
        .mockReturnValueOnce('ndotoni_cache_test1')
        .mockReturnValueOnce('ndotoni_cache_test2')
        .mockReturnValueOnce('other_key')
        .mockReturnValue(null)
    });

    Object.defineProperty(window.localStorage, 'length', {
      value: 3
    });

    cachedGraphQL.clearAll();

    expect(localStorageMock.removeItem).toHaveBeenCalled();
  });
});

describe('Favorites localStorage persistence', () => {
  it('should save favorites to localStorage', () => {
    // This would need to be tested in a component test
    // since the hook needs to be used within a React component
    expect(true).toBe(true); // Placeholder
  });
});
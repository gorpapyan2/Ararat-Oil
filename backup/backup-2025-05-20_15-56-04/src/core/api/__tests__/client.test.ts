/**
 * API Client Tests
 * 
 * This file contains unit tests for the core API client functionality.
 */

import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { fetchFromFunction, createApiError, isNetworkError } from '../client';
import { API_ERROR_TYPE } from '@/core/config/api';

// Mock the Supabase auth
vi.mock('../supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: {
          session: {
            access_token: 'mock-token',
          },
        },
      }),
    },
  },
}));

// Mock the fetch API
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock AbortSignal.timeout
global.AbortSignal = {
  ...global.AbortSignal,
  timeout: vi.fn().mockReturnValue({} as AbortSignal),
} as unknown as AbortSignal;

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('fetchFromFunction', () => {
    it('should make a GET request with the correct URL and headers', async () => {
      // Arrange
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ data: { id: '1', name: 'Test' } }),
        status: 200,
        headers: new Headers({ 'x-request-id': 'test-request-id' }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      // Act
      const result = await fetchFromFunction('test-endpoint');

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('test-endpoint'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token',
          }),
        })
      );
      expect(result.data).toEqual({ id: '1', name: 'Test' });
      expect(result.status).toBe(200);
      expect(result.metadata?.requestId).toBe('test-request-id');
    });

    it('should handle query parameters correctly', async () => {
      // Arrange
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ data: [] }),
        status: 200,
        headers: new Headers(),
      };
      mockFetch.mockResolvedValue(mockResponse);

      // Act
      await fetchFromFunction('test-endpoint', {
        queryParams: { 
          page: 1, 
          limit: 10, 
          filter: 'active', 
          include_deleted: false, 
          null_param: null, 
          undefined_param: undefined 
        },
      });

      // Assert
      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toContain('page=1');
      expect(calledUrl).toContain('limit=10');
      expect(calledUrl).toContain('filter=active');
      expect(calledUrl).toContain('include_deleted=false');
      expect(calledUrl).not.toContain('null_param');
      expect(calledUrl).not.toContain('undefined_param');
    });

    it('should handle error responses correctly', async () => {
      // Arrange
      const errorBody = { error: 'Not found' };
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue(errorBody),
        status: 404,
        headers: new Headers(),
      };
      mockFetch.mockResolvedValue(mockResponse);

      // Act
      const result = await fetchFromFunction('test-endpoint');

      // Assert
      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe(API_ERROR_TYPE.NOT_FOUND);
      expect(result.error?.message).toBe('Not found');
      expect(result.error?.status).toBe(404);
    });

    it('should handle network errors', async () => {
      // Arrange
      const networkError = new TypeError('Failed to fetch');
      mockFetch.mockRejectedValue(networkError);

      // Act
      const result = await fetchFromFunction('test-endpoint');

      // Assert
      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe(API_ERROR_TYPE.NETWORK);
      expect(result.error?.message).toBe('Network connection error');
      expect(result.error?.originalError).toBe(networkError);
    });
  });

  describe('isNetworkError', () => {
    it('should identify network errors correctly', () => {
      expect(isNetworkError(new Error('Failed to fetch'))).toBe(true);
      expect(isNetworkError(new Error('Network Error'))).toBe(true);
      expect(isNetworkError(new TypeError('Failed to fetch'))).toBe(true);
      expect(isNetworkError(new Error('Not a network error'))).toBe(false);
    });
  });

  describe('createApiError', () => {
    it('should create a properly formatted API error', () => {
      const error = createApiError(
        API_ERROR_TYPE.VALIDATION,
        'Invalid input',
        400,
        { details: ['Field required'] }
      );

      expect(error.type).toBe(API_ERROR_TYPE.VALIDATION);
      expect(error.message).toBe('Invalid input');
      expect(error.status).toBe(400);
      expect(error.originalError).toEqual({ details: ['Field required'] });
    });
  });
}); 
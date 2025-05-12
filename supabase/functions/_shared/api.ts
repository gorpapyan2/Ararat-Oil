import { handleError } from './database.ts';
import type { ApiResponse } from './types.ts';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

/**
 * Handles CORS preflight requests
 */
export function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  return null;
}

/**
 * Creates a JSON response with appropriate headers
 */
export function createJsonResponse<T>(data: ApiResponse<T>, status = 200): Response {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    }
  );
}

/**
 * Creates a success response
 */
export function successResponse<T>(data: T, status = 200): Response {
  return createJsonResponse({ data }, status);
}

/**
 * Creates an error response
 */
export function errorResponse(error: unknown, status = 400): Response {
  const errorData = handleError(error);
  return createJsonResponse(errorData, status);
}

/**
 * Parses JSON from request body
 */
export async function parseRequestBody<T>(request: Request): Promise<T> {
  try {
    const contentType = request.headers.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Content-Type must be application/json');
    }
    
    return await request.json() as T;
  } catch (error) {
    throw new Error(`Failed to parse request body: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Parses URL parameters from request
 */
export function getUrlParams(request: Request): URLSearchParams {
  const url = new URL(request.url);
  return url.searchParams;
}

/**
 * Returns a 405 Method Not Allowed response
 */
export function methodNotAllowed(): Response {
  return errorResponse({ message: 'Method not allowed' }, 405);
}

/**
 * Returns a 401 Unauthorized response
 */
export function unauthorized(): Response {
  return errorResponse({ message: 'Unauthorized' }, 401);
}

/**
 * Returns a 404 Not Found response
 */
export function notFound(resource = 'Resource'): Response {
  return errorResponse({ message: `${resource} not found` }, 404);
} 
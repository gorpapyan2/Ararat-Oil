// --- CORS CONFIG ---
export const ALLOWED_ORIGINS = [
  'http://localhost:3005',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:4173',
  'https://araratoil.am',
  'https://qnghvjeunmicykrzpeog.supabase.co',
];

export function getCorsHeaders(origin: string | null): Record<string, string> {
  // For development, be more permissive with localhost origins
  let allowOrigin = '*';
  
  if (origin) {
    if (origin.startsWith('http://localhost:') || ALLOWED_ORIGINS.includes(origin)) {
      allowOrigin = origin;
    }
  }

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-auth',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
  };
}

/**
 * Handle CORS preflight requests and set appropriate headers
 * @param request The incoming request
 * @returns Response for OPTIONS requests or null for other methods (to continue processing)
 */
export function handleCors(request: Request): Response | null {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  // Always handle OPTIONS requests (preflight)
  if (request.method === 'OPTIONS') {
    return new Response('ok', { status: 204, headers: corsHeaders });
  }
  
  // Allow all requests in development (return null to continue processing)
  return null;
}

// Export the CORS headers for use in responses
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-auth',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Credentials': 'true',
};
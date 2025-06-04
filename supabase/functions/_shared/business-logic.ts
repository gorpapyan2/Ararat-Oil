/**
 * Shared Business Logic Utilities for Supabase Edge Functions
 * 
 * This module centralizes common business logic patterns to reduce duplication
 * across Edge Functions and improve maintainability.
 */

import { createClient } from "npm:@supabase/supabase-js@2.38.4";

// Types for standardized API responses
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Initialize Supabase client for server-side operations
export function createSupabaseClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  
  return createClient(supabaseUrl, supabaseKey);
}

/**
 * Centralized error handling utility
 */
export class BusinessLogicError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
    public code?: string
  ) {
    super(message);
    this.name = "BusinessLogicError";
  }
}

/**
 * Standardized error handler for Edge Functions
 */
export function handleError(error: unknown): Response {
  console.error("Business Logic Error:", error);

  if (error instanceof BusinessLogicError) {
    return new Response(
      JSON.stringify({
        error: error.message,
        code: error.code,
        status: error.statusCode,
      }),
      {
        status: error.statusCode,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Handle Supabase errors
  if (error && typeof error === "object" && "message" in error) {
    return new Response(
      JSON.stringify({
        error: (error as any).message,
        status: 500,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Generic error
  return new Response(
    JSON.stringify({
      error: "An unexpected error occurred",
      status: 500,
    }),
    {
      status: 500,
      headers: { "Content-Type": "application/json" },
    }
  );
}

/**
 * Standardized success response helper
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): Response {
  return new Response(
    JSON.stringify({
      data,
      message,
      status,
    }),
    {
      status,
      headers: { 
        "Content-Type": "application/json",
        "Connection": "keep-alive"
      },
    }
  );
}

/**
 * Generic CRUD operations builder
 */
export class CrudOperations<T = any> {
  constructor(
    private supabase: ReturnType<typeof createSupabaseClient>,
    protected tableName: string
  ) {}

  async getAll(filters?: Record<string, any>, pagination?: PaginationParams): Promise<T[]> {
    let query = this.supabase.from(this.tableName).select("*");

    // Apply filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }

    // Apply pagination
    if (pagination?.limit) {
      const offset = pagination.offset || (pagination.page ? (pagination.page - 1) * pagination.limit : 0);
      query = query.range(offset, offset + pagination.limit - 1);
    }

    const { data, error } = await query;

    if (error) {
      throw new BusinessLogicError(`Failed to fetch ${this.tableName}: ${error.message}`, 500);
    }

    return data || [];
  }

  async getById(id: string): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Not found
      }
      throw new BusinessLogicError(`Failed to fetch ${this.tableName} by ID: ${error.message}`, 500);
    }

    return data;
  }

  async create(data: Partial<T>): Promise<T> {
    const { data: created, error } = await this.supabase
      .from(this.tableName)
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new BusinessLogicError(`Failed to create ${this.tableName}: ${error.message}`, 400);
    }

    return created;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const { data: updated, error } = await this.supabase
      .from(this.tableName)
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new BusinessLogicError(`Failed to update ${this.tableName}: ${error.message}`, 400);
    }

    return updated;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq("id", id);

    if (error) {
      throw new BusinessLogicError(`Failed to delete ${this.tableName}: ${error.message}`, 400);
    }
  }

  async exists(field: string, value: any, excludeId?: string): Promise<boolean> {
    let query = this.supabase
      .from(this.tableName)
      .select("id")
      .eq(field, value);

    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    const { data, error } = await query.limit(1);

    if (error) {
      throw new BusinessLogicError(`Failed to check existence in ${this.tableName}: ${error.message}`, 500);
    }

    return data && data.length > 0;
  }
}

/**
 * Common validation utilities
 */
export class ValidationUtils {
  static validateRequired(data: Record<string, any>, requiredFields: string[]): ValidationResult {
    const errors: string[] = [];

    requiredFields.forEach(field => {
      if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
        errors.push(`${field} is required`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  static validateNumericRange(value: number, min?: number, max?: number): boolean {
    if (min !== undefined && value < min) return false;
    if (max !== undefined && value > max) return false;
    return true;
  }

  static validateStringLength(value: string, min?: number, max?: number): boolean {
    if (min !== undefined && value.length < min) return false;
    if (max !== undefined && value.length > max) return false;
    return true;
  }
}

/**
 * Authentication utilities
 */
export async function validateAuthToken(request: Request): Promise<{user: any, session: any} | null> {
  const authHeader = request.headers.get("Authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  const supabase = createSupabaseClient();

  try {
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      return null;
    }

    return { user: data.user, session: data };
  } catch {
    return null;
  }
}

/**
 * Route handler utility for Express-like routing in Edge Functions
 */
export interface RouteHandler {
  (request: Request, params: Record<string, string>): Promise<Response>;
}

export class Router {
  private routes: Map<string, Map<string, RouteHandler>> = new Map();

  addRoute(method: string, pattern: string, handler: RouteHandler) {
    if (!this.routes.has(method)) {
      this.routes.set(method, new Map());
    }
    this.routes.get(method)!.set(pattern, handler);
  }

  get(pattern: string, handler: RouteHandler) {
    this.addRoute("GET", pattern, handler);
  }

  post(pattern: string, handler: RouteHandler) {
    this.addRoute("POST", pattern, handler);
  }

  put(pattern: string, handler: RouteHandler) {
    this.addRoute("PUT", pattern, handler);
  }

  delete(pattern: string, handler: RouteHandler) {
    this.addRoute("DELETE", pattern, handler);
  }

  async handle(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;
    const pathname = url.pathname;

    const methodRoutes = this.routes.get(method);
    if (!methodRoutes) {
      return new Response("Method not allowed", { status: 405 });
    }

    // Simple pattern matching (could be enhanced with regex patterns)
    for (const [pattern, handler] of methodRoutes.entries()) {
      const params = this.matchRoute(pattern, pathname);
      if (params !== null) {
        try {
          return await handler(request, params);
        } catch (error) {
          return handleError(error);
        }
      }
    }

    return new Response("Not found", { status: 404 });
  }

  private matchRoute(pattern: string, pathname: string): Record<string, string> | null {
    // Remove function name prefix if present (e.g., /function-name/route)
    const cleanPathname = pathname.replace(/^\/[^\/]+/, '');
    const cleanPattern = pattern.replace(/^\/[^\/]+/, '');

    const patternParts = cleanPattern.split('/').filter(p => p);
    const pathParts = cleanPathname.split('/').filter(p => p);

    if (patternParts.length !== pathParts.length) {
      return null;
    }

    const params: Record<string, string> = {};

    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i];
      const pathPart = pathParts[i];

      if (patternPart.startsWith(':')) {
        // Parameter
        params[patternPart.slice(1)] = pathPart;
      } else if (patternPart !== pathPart) {
        // Literal mismatch
        return null;
      }
    }

    return params;
  }
}

/**
 * Audit logging utility
 */
export class AuditLogger {
  constructor(private supabase: ReturnType<typeof createSupabaseClient>) {}

  async log(action: string, entityType: string, entityId: string, userId?: string, metadata?: any) {
    try {
      await this.supabase
        .from('audit_logs')
        .insert({
          action,
          entity_type: entityType,
          entity_id: entityId,
          user_id: userId,
          metadata,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Failed to log audit entry:', error);
      // Don't throw - audit logging should not break business operations
    }
  }
} 
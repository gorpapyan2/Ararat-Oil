import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import {
  Router,
  handleError,
  createSuccessResponse,
  validateAuthToken,
} from "../_shared/business-logic.ts";

import {
  employeeDataService,
  fuelTypeDataService,
  tankDataService,
  petrolProviderDataService,
  fillingSystemDataService,
  createDataService,
  type BaseEntity,
} from "../_shared/data-service.ts";

// Map entity types to their corresponding data services
const dataServices = {
  employees: employeeDataService,
  fuel_types: fuelTypeDataService,
  tanks: tankDataService,
  petrol_providers: petrolProviderDataService,
  filling_systems: fillingSystemDataService,
} as const;

type EntityType = keyof typeof dataServices;

// Create router instance
const router = new Router();

/**
 * GET /centralized-crud/:entityType
 * Get all entities with optional filtering and pagination
 */
router.get("/:entityType", async (request, params) => {
  const entityType = params.entityType as EntityType;
  const url = new URL(request.url);
  
  // Validate entity type
  if (!dataServices[entityType]) {
    throw new Error(`Unsupported entity type: ${entityType}`);
  }

  // Parse query parameters
  const filters: Record<string, any> = {};
  const pagination: any = {};
  
  for (const [key, value] of url.searchParams.entries()) {
    if (key === 'page') pagination.page = parseInt(value);
    else if (key === 'limit') pagination.limit = parseInt(value);
    else if (key === 'offset') pagination.offset = parseInt(value);
    else filters[key] = value;
  }

  const dataService = dataServices[entityType];
  const data = await dataService.getAll(filters, pagination);
  
  return createSuccessResponse(data);
});

/**
 * GET /centralized-crud/:entityType/active
 * Get only active entities
 */
router.get("/:entityType/active", async (request, params) => {
  const entityType = params.entityType as EntityType;
  const url = new URL(request.url);
  
  if (!dataServices[entityType]) {
    throw new Error(`Unsupported entity type: ${entityType}`);
  }

  // Parse pagination parameters
  const pagination: any = {};
  if (url.searchParams.get('page')) pagination.page = parseInt(url.searchParams.get('page')!);
  if (url.searchParams.get('limit')) pagination.limit = parseInt(url.searchParams.get('limit')!);
  if (url.searchParams.get('offset')) pagination.offset = parseInt(url.searchParams.get('offset')!);

  const dataService = dataServices[entityType];
  const data = await dataService.getActive(pagination);
  
  return createSuccessResponse(data);
});

/**
 * GET /centralized-crud/:entityType/stats
 * Get entity statistics
 */
router.get("/:entityType/stats", async (request, params) => {
  const entityType = params.entityType as EntityType;
  
  if (!dataServices[entityType]) {
    throw new Error(`Unsupported entity type: ${entityType}`);
  }

  const dataService = dataServices[entityType];
  const stats = await dataService.getStats();
  
  return createSuccessResponse(stats);
});

/**
 * GET /centralized-crud/:entityType/search
 * Search entities
 */
router.get("/:entityType/search", async (request, params) => {
  const entityType = params.entityType as EntityType;
  const url = new URL(request.url);
  
  if (!dataServices[entityType]) {
    throw new Error(`Unsupported entity type: ${entityType}`);
  }

  const searchTerm = url.searchParams.get('q') || '';
  const searchFields = url.searchParams.get('fields')?.split(',') || ['name'];
  
  // Parse other filters
  const filters: Record<string, any> = {};
  const pagination: any = {};
  
  for (const [key, value] of url.searchParams.entries()) {
    if (['q', 'fields'].includes(key)) continue;
    if (key === 'page') pagination.page = parseInt(value);
    else if (key === 'limit') pagination.limit = parseInt(value);
    else if (key === 'offset') pagination.offset = parseInt(value);
    else filters[key] = value;
  }

  const dataService = dataServices[entityType];
  const data = await dataService.search(searchTerm, searchFields, filters, pagination);
  
  return createSuccessResponse(data);
});

/**
 * GET /centralized-crud/:entityType/:id
 * Get entity by ID
 */
router.get("/:entityType/:id", async (request, params) => {
  const entityType = params.entityType as EntityType;
  const id = params.id;
  
  if (!dataServices[entityType]) {
    throw new Error(`Unsupported entity type: ${entityType}`);
  }

  const dataService = dataServices[entityType];
  const data = await dataService.getById(id);
  
  if (!data) {
    throw new Error(`${entityType} with ID ${id} not found`);
  }
  
  return createSuccessResponse(data);
});

/**
 * POST /centralized-crud/:entityType
 * Create new entity
 */
router.post("/:entityType", async (request, params) => {
  const entityType = params.entityType as EntityType;
  
  if (!dataServices[entityType]) {
    throw new Error(`Unsupported entity type: ${entityType}`);
  }

  // Validate authentication
  const auth = await validateAuthToken(request);
  if (!auth) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const dataService = dataServices[entityType];
  const created = await dataService.createWithValidation(body, auth.user.id);
  
  return createSuccessResponse(created, `${entityType} created successfully`, 201);
});

/**
 * POST /centralized-crud/:entityType/bulk
 * Bulk create entities
 */
router.post("/:entityType/bulk", async (request, params) => {
  const entityType = params.entityType as EntityType;
  
  if (!dataServices[entityType]) {
    throw new Error(`Unsupported entity type: ${entityType}`);
  }

  // Validate authentication
  const auth = await validateAuthToken(request);
  if (!auth) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  if (!Array.isArray(body)) {
    throw new Error("Request body must be an array for bulk operations");
  }

  const dataService = dataServices[entityType];
  const created = await dataService.bulkCreate(body, auth.user.id);
  
  return createSuccessResponse(created, `${created.length} ${entityType} created successfully`, 201);
});

/**
 * PUT /centralized-crud/:entityType/:id
 * Update entity
 */
router.put("/:entityType/:id", async (request, params) => {
  const entityType = params.entityType as EntityType;
  const id = params.id;
  
  if (!dataServices[entityType]) {
    throw new Error(`Unsupported entity type: ${entityType}`);
  }

  // Validate authentication
  const auth = await validateAuthToken(request);
  if (!auth) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const dataService = dataServices[entityType];
  const updated = await dataService.updateWithValidation(id, body, auth.user.id);
  
  return createSuccessResponse(updated, `${entityType} updated successfully`);
});

/**
 * DELETE /centralized-crud/:entityType/:id
 * Delete entity (hard delete)
 */
router.delete("/:entityType/:id", async (request, params) => {
  const entityType = params.entityType as EntityType;
  const id = params.id;
  
  if (!dataServices[entityType]) {
    throw new Error(`Unsupported entity type: ${entityType}`);
  }

  // Validate authentication
  const auth = await validateAuthToken(request);
  if (!auth) {
    return new Response("Unauthorized", { status: 401 });
  }

  const dataService = dataServices[entityType];
  await dataService.deleteWithAudit(id, auth.user.id);
  
  return createSuccessResponse(null, `${entityType} deleted successfully`);
});

/**
 * DELETE /centralized-crud/:entityType/:id/soft
 * Soft delete entity (set status to inactive)
 */
router.delete("/:entityType/:id/soft", async (request, params) => {
  const entityType = params.entityType as EntityType;
  const id = params.id;
  
  if (!dataServices[entityType]) {
    throw new Error(`Unsupported entity type: ${entityType}`);
  }

  // Validate authentication
  const auth = await validateAuthToken(request);
  if (!auth) {
    return new Response("Unauthorized", { status: 401 });
  }

  const dataService = dataServices[entityType];
  const updated = await dataService.softDelete(id, auth.user.id);
  
  return createSuccessResponse(updated, `${entityType} soft deleted successfully`);
});

// Main handler
Deno.serve(async (req: Request) => {
  try {
    return await router.handle(req);
  } catch (error) {
    return handleError(error);
  }
}); 
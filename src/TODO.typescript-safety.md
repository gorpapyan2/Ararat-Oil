# TODO: TypeScript Safety

## Goals

- Ensure type safety and reduce manual type assertions.
- Keep TypeScript types in sync with the Supabase schema.

## Steps

1. Set up Supabase codegen to generate TypeScript types from the database schema.
2. Refactor service files to use generated types instead of manual type assertions.
3. Remove unnecessary type assertions and add stricter type checks.
4. Add type tests or checks to catch type drift early.
5. Document the process for regenerating types when the schema changes.

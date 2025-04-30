# Project Cleanup & Issue Resolution Tasks

## Static Analysis Findings

- [x] Remove unused dependencies and devDependencies (see `depcheck` results)
- [x] Investigate and resolve `[Table] Column with id 'provider.name' does not exist.` error in UnifiedDataTable
- [ ] Add `autocomplete` attributes to all form input elements (especially login forms)
- [ ] Check for and remove any hardcoded references to `localhost:8080` if not needed
- [ ] Review and optimize slow click handlers if UI lag is observed
- [ ] Clean up logger output if too verbose
- [ ] Review and update translation keys for consistency (especially for provider-related tables)

## Next Steps

1. **Remove unused dependencies**
   - ~~`@radix-ui/react-progress`~~ (not present in package.json)
   - ~~`@sentry/tracing`~~ (not present in package.json)
   - ~~`supabase`~~ (kept `@supabase/supabase-js` as it's used throughout the codebase)
   - Dev: ~~`@tailwindcss/typography`~~ (not present in package.json), ~~`autoprefixer`~~, ~~`postcss`~~, ~~`i18next-http-backend`~~ (removed references from vite.config.ts)
2. **Fix UnifiedDataTable column id mismatch**
   - ~~Ensure columns and `searchColumn` prop match the data structure~~ (Added custom nested property filter)
3. **Add autocomplete attributes**
   - Update all relevant `<input>` elements
4. **Check for hardcoded backend URLs**
   - Update/remove as needed
5. **Optimize event handlers**
   - Profile and refactor if necessary
6. **Translation audit**
   - Ensure all UI strings are translated and keys are consistent

---

## Progress Log

- [x] [x] Unused dependencies removed
- [x] [x] UnifiedDataTable column error fixed
- [ ] [ ] Autocomplete attributes added
- [ ] [ ] Hardcoded URLs checked
- [ ] [ ] Event handlers optimized
- [ ] [ ] Translation keys audited

---

Add new issues and check off completed items as you go. 
# Services Directory Cleanup Plan

## 🚨 **Current Problem**
The `src/services/` directory contains **significant redundancy** with multiple patterns for the same functionality:

1. **Legacy individual entity services** (e.g., `employees.ts`, `tanks.ts`)
2. **Modern centralized API** (`centralized-api.ts`) 
3. **Core API layer** (`api.ts`)
4. **Test/integration files** that shouldn't be in production

## 📋 **Cleanup Strategy**

### **Phase 1: Remove Deprecated Entity Services**
These services are **completely replaced** by `centralized-api.ts` and `useCentralizedEntity` hook:

```bash
# REMOVE these files - they're duplicated by centralized-api.ts
src/services/employees.ts           # ❌ DEPRECATED 
src/services/tanks.ts              # ❌ DEPRECATED
src/services/fuel-types.ts         # ❌ DEPRECATED  
src/services/petrol-providers.ts   # ❌ DEPRECATED
src/services/filling-systems.ts    # ❌ DEPRECATED
src/services/fuel-prices.ts        # ❌ DEPRECATED
src/services/shifts.ts             # ❌ DEPRECATED
src/services/sales.ts              # ❌ DEPRECATED
src/services/fuel-supplies.ts      # ❌ DEPRECATED
src/services/transactions.ts       # ❌ DEPRECATED
```

### **Phase 2: Remove Test/Legacy Files**
```bash
# REMOVE test and legacy integration files
src/services/supabase-test.ts      # ❌ Test file in production
src/services/supabase-integration.ts # ❌ Legacy integration
src/services/fuelManagement.ts     # ❌ Duplicates tanks/fuel functionality
```

### **Phase 3: Keep Core Services**
```bash
# KEEP these - they're the modern architecture
src/services/centralized-api.ts    # ✅ Modern unified API
src/services/api.ts                # ✅ Core Edge Function client
src/services/supabase.ts           # ✅ Supabase client
src/services/logger.ts             # ✅ Logging utility
src/services/type-adapters.ts      # ✅ Type conversion utility
```

### **Phase 4: Handle Business Logic Services**
```bash
# REVIEW these for business logic vs API calls
src/services/profit-loss.ts        # 🔍 Contains business logic - keep but review
src/services/financials.ts         # 🔍 Contains business logic - keep but review  
src/services/dashboard.ts          # 🔍 Dashboard aggregation - keep but review
```

## 🔧 **Migration Steps**

### **Step 1: Update Feature Service Imports**
Many features are still importing from deprecated services:

```typescript
// BEFORE (deprecated)
import { fetchTanks } from "@/services/tanks";

// AFTER (modern)  
import { useCentralizedEntity } from "@/hooks/useCentralizedEntity";
const { data: tanks } = useCentralizedEntity<Tank>('tanks');
```

### **Step 2: Update Feature Re-exports**  
Features like `src/features/tanks/services/index.ts` re-export deprecated services:

```typescript
// BEFORE
export * from "@/services/tanks";

// AFTER  
export { useTanks } from "@/hooks/useCentralizedEntity";
```

### **Step 3: Check Edge Function Dependencies**
Ensure Supabase Edge Functions don't import deprecated services.

## ⚠️ **Breaking Changes**
This cleanup will require updates to:

1. **Feature service layers** - Update imports to use centralized patterns
2. **Component imports** - Update direct service imports  
3. **Tests** - Update mocked services
4. **Documentation** - Update API documentation

## 📊 **Expected Impact**
- **Remove ~70% of service files** (14 out of 22 files)
- **Reduce codebase size** by ~30KB  
- **Eliminate code duplication**
- **Improve maintainability**
- **Consistent API patterns**

## 🎯 **Final Architecture**
```
src/services/
├── centralized-api.ts      # 🌟 Modern unified CRUD API
├── api.ts                  # 🌟 Core Edge Function client  
├── supabase.ts            # 🌟 Supabase client
├── logger.ts              # 🌟 Logging utility
├── type-adapters.ts       # 🌟 Type utilities
├── profit-loss.ts         # 💼 Business logic (review)
├── financials.ts          # 💼 Business logic (review)
└── dashboard.ts           # 💼 Aggregation logic (review)
```

## ✅ **Ready to Execute?**
This plan will significantly clean up the architecture and eliminate technical debt. All deprecated functionality is already replaced by the modern centralized approach. 
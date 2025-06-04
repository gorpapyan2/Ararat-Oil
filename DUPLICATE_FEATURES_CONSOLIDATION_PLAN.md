# Duplicate Features Consolidation Plan

## 📊 **Duplication Analysis Summary**

### **Critical Duplications Found**

#### 1. **Toast Hooks** (High Priority)
- **Files Involved**: 
  - `src/core/hooks/useToast.ts` (main implementation - 120 lines)
  - `src/core/hooks/use-toast.ts` (re-export - 8 lines)
  - `src/hooks/useToast.ts` (re-export - 2 lines)
  - Multiple index file re-exports

- **Issues**: 
  - Multiple import paths for same functionality
  - Inconsistent naming (`useToast` vs `use-toast`)
  - Unnecessary re-export layers

#### 2. **Auth Hooks** (High Priority)
- **Files Involved**:
  - `src/core/hooks/useAuth.tsx` (252 lines)
  - `src/features/auth/hooks/useAuth.ts` (separate implementation)
  - `src/hooks/useAuth.ts` (re-export)

- **Issues**:
  - Two separate auth implementations
  - Potential conflict between feature-specific and core auth
  - Different import paths used across codebase

#### 3. **Formatting Utilities** (Medium Priority)
- **Files Involved**:
  - `src/lib/formatters.ts` (131 lines - Armenian locale focus)
  - `src/shared/utils/formatting.ts` (197 lines - broader functions)

- **Overlapping Functions**:
  - `formatDate` (different implementations)
  - `formatCurrency` (different locales)
  - `formatNumber` (different approaches)

#### 4. **Dialog Hooks** (Medium Priority)
- **Files Involved**:
  - `src/core/hooks/useDialog.ts` (262 lines)
  - `src/hooks/useDialog.ts` (re-export)

#### 5. **Component Architecture** (Low Priority)
- **Issues**:
  - Core UI components mostly placeholders
  - Shared UI components better organized
  - Potential for consolidation

## 🎯 **Consolidation Strategy**

### **Phase 1: Hook Consolidation (Immediate)**

#### Toast Hooks Cleanup
1. **Keep**: `src/core/hooks/useToast.ts` as the single source of truth
2. **Remove**: `src/core/hooks/use-toast.ts` (redundant re-export)
3. **Simplify**: `src/hooks/useToast.ts` to simple re-export
4. **Update**: All imports to use consistent path

#### Auth Hooks Consolidation
1. **Audit**: Compare both auth implementations
2. **Merge**: Combine best features into single implementation
3. **Standardize**: Single import path for all auth functionality
4. **Test**: Ensure no breaking changes

#### Dialog Hooks Simplification
1. **Keep**: Core implementation in `src/core/hooks/useDialog.ts`
2. **Simplify**: Top-level re-export
3. **Update**: All import paths

### **Phase 2: Utility Consolidation (Secondary)**

#### Formatting Utilities Merge
1. **Create**: Single `src/lib/utils/formatting.ts`
2. **Combine**: Best features from both files
3. **Standardize**: Consistent locale handling
4. **Migrate**: All usages to new consolidated file

### **Phase 3: Component Architecture (Future)**

#### UI Components Consolidation
1. **Evaluate**: Which components are actively used
2. **Consolidate**: Move functional components to single location
3. **Remove**: Placeholder-only files
4. **Standardize**: Import paths

## ⚡ **Implementation Steps**

### **Step 1: Toast Hooks**
```bash
# Remove redundant file
rm src/core/hooks/use-toast.ts

# Update all imports from use-toast to useToast
# Standardize import paths
```

### **Step 2: Auth Hooks**
```bash
# Analyze both implementations
# Create unified auth hook
# Update all imports
# Test thoroughly
```

### **Step 3: Formatting Utils**
```bash
# Create consolidated formatting utility
# Merge functions with locale options
# Update all imports
# Test formatting functions
```

### **Step 4: Dialog Hooks**
```bash
# Simplify re-export structure
# Update import paths
# Verify functionality
```

## 📈 **Expected Benefits**

### **Immediate Benefits**
- **Reduced Bundle Size**: Eliminate duplicate code
- **Improved Maintainability**: Single source of truth for each feature
- **Consistent APIs**: Standardized interfaces across project
- **Cleaner Imports**: Simplified import paths

### **Long-term Benefits**
- **Easier Debugging**: Clear code ownership
- **Better Performance**: Reduced code duplication
- **Simplified Testing**: Single implementation to test
- **Developer Experience**: Less confusion about which import to use

## 🚨 **Risk Mitigation**

### **Testing Strategy**
1. **Unit Tests**: Verify each consolidated hook/utility
2. **Integration Tests**: Ensure components still work
3. **Import Path Testing**: Verify all imports resolve correctly
4. **Regression Testing**: Check existing functionality

### **Rollback Plan**
1. **Git Branches**: Create feature branches for each consolidation
2. **Incremental Changes**: One consolidation at a time
3. **Verification Points**: Test after each change
4. **Backup Strategy**: Keep old files temporarily

## 📋 **Priority Execution Order**

### **High Priority (Week 1)**
1. ✅ Toast hooks consolidation
2. ✅ Dialog hooks simplification
3. ✅ Remove redundant re-export files

### **Medium Priority (Week 2)**
4. ✅ Auth hooks evaluation and consolidation
5. ✅ Formatting utilities merge

### **Low Priority (Week 3)**
6. ✅ Component architecture cleanup
7. ✅ Import path standardization
8. ✅ Documentation updates

---

**Next Action**: Begin with Toast hooks consolidation as it has the most straightforward solution and lowest risk. 
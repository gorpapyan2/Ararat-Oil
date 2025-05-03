/**
 * Simplified Component Audit Script (ES Modules version)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const SRC_DIR = path.resolve(__dirname, 'src');
const UI_DIRS = [
  path.resolve(SRC_DIR, 'components/ui'),
  path.resolve(SRC_DIR, 'components/ui-custom')
];

// Report object
const report = {
  components: {},
  duplicates: [],
  inconsistentNaming: [],
  potentialUnused: []
};

// Start audit
console.log('Starting component audit...');

// Check for duplicate components
console.log('\nChecking for duplicate components...');
const componentMap = new Map();

// Process UI directories
UI_DIRS.forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`Directory not found: ${dir}`);
    return;
  }
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    if (!file.endsWith('.tsx') && !file.endsWith('.ts')) return;
    
    const componentName = file.replace(/\.(tsx|ts)$/, '');
    const normalizedName = componentName.toLowerCase();
    
    if (!componentMap.has(normalizedName)) {
      componentMap.set(normalizedName, []);
    }
    
    componentMap.get(normalizedName).push({
      name: componentName,
      path: path.join(dir, file),
      directory: path.basename(dir)
    });
    
    // Check naming convention consistency
    if ((file.includes('-') && /^[A-Z]/.test(componentName)) || 
        (!file.includes('-') && file !== 'index.ts' && /^[a-z]/.test(componentName))) {
      report.inconsistentNaming.push({
        name: componentName,
        path: path.join(dir, file)
      });
    }
    
    // Check for potential showcase/demo components
    if (componentName.includes('Showcase') || componentName.includes('Demo')) {
      report.potentialUnused.push({
        name: componentName,
        path: path.join(dir, file),
        reason: 'Showcase/Demo component'
      });
    }
  });
});

// Find duplicates
for (const [name, instances] of componentMap.entries()) {
  if (instances.length > 1) {
    report.duplicates.push({
      name,
      instances
    });
  }
}

// Check for similar functionality components
const similarComponentGroups = [
  ['card', 'data-card'],
  ['table', 'data-table', 'enhanced-table', 'mobile-aware-data-table'],
  ['toast', 'toaster', 'sonner'],
  ['theme', 'themeswitcher', 'themetoggle']
];

similarComponentGroups.forEach(group => {
  const foundComponents = [];
  
  for (const [componentName, instances] of componentMap.entries()) {
    if (group.some(g => componentName.toLowerCase().includes(g.toLowerCase()))) {
      foundComponents.push({
        name: componentName,
        instances
      });
    }
  }
  
  if (foundComponents.length > 1) {
    console.log(`\nPotential similar functionality: ${group.join(', ')}`);
    foundComponents.forEach(comp => {
      console.log(`- ${comp.name} (${comp.instances.length} instances)`);
      comp.instances.forEach(inst => {
        console.log(`  * ${inst.directory}/${inst.name}`);
      });
    });
  }
});

// Output report
console.log('\n=== COMPONENT AUDIT REPORT ===');
console.log(`\nTotal components checked: ${componentMap.size}`);
console.log(`Duplicate components found: ${report.duplicates.length}`);
console.log(`Inconsistent naming conventions: ${report.inconsistentNaming.length}`);
console.log(`Potential unused components: ${report.potentialUnused.length}`);

if (report.duplicates.length > 0) {
  console.log('\n--- DUPLICATE COMPONENTS ---');
  report.duplicates.forEach(item => {
    console.log(`\nComponent: ${item.name}`);
    item.instances.forEach(instance => {
      console.log(`- ${instance.directory}/${instance.name}`);
    });
  });
}

if (report.inconsistentNaming.length > 0) {
  console.log('\n--- INCONSISTENT NAMING ---');
  report.inconsistentNaming.forEach(item => {
    console.log(`- ${item.name}: ${item.path}`);
  });
}

if (report.potentialUnused.length > 0) {
  console.log('\n--- POTENTIAL UNUSED COMPONENTS ---');
  report.potentialUnused.forEach(item => {
    console.log(`- ${item.name}: ${item.path} (${item.reason})`);
  });
}

// Write to file
const reportJson = JSON.stringify(report, null, 2);
fs.writeFileSync(path.resolve(__dirname, 'component-audit-results.json'), reportJson);

console.log('\nAudit complete. Results saved to component-audit-results.json'); 
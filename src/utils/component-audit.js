/**
 * Simplified Component Audit Script
 *
 * This script helps identify duplicate and unused components
 */
const fs = require("fs");
const path = require("path");

const SRC_DIR = path.resolve(__dirname, "..");
const UI_DIRS = [
  path.resolve(SRC_DIR, "components/ui"),
  path.resolve(SRC_DIR, "components/ui-custom"),
];

// Report object
const report = {
  components: {},
  duplicates: [],
  inconsistentNaming: [],
};

// Start audit
console.log("Starting component audit...");

// Check for duplicate components
console.log("\nChecking for duplicate components...");
const componentMap = new Map();

// Process UI directories
UI_DIRS.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    console.log(`Directory not found: ${dir}`);
    return;
  }

  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    if (!file.endsWith(".tsx") && !file.endsWith(".ts")) return;

    const componentName = file.replace(/\.(tsx|ts)$/, "");
    const normalizedName = componentName.toLowerCase();

    if (!componentMap.has(normalizedName)) {
      componentMap.set(normalizedName, []);
    }

    componentMap.get(normalizedName).push({
      name: componentName,
      path: path.join(dir, file),
      directory: path.basename(dir),
    });

    // Check naming convention consistency
    if (
      (file.includes("-") && /^[A-Z]/.test(componentName)) ||
      (!file.includes("-") &&
        file !== "index.ts" &&
        /^[a-z]/.test(componentName))
    ) {
      report.inconsistentNaming.push({
        name: componentName,
        path: path.join(dir, file),
      });
    }
  });
});

// Find duplicates
for (const [name, instances] of componentMap.entries()) {
  if (instances.length > 1) {
    report.duplicates.push({
      name,
      instances,
    });
  }
}

// Output report
console.log("\n=== COMPONENT AUDIT REPORT ===");
console.log(`\nTotal components checked: ${componentMap.size}`);
console.log(`Duplicate components found: ${report.duplicates.length}`);
console.log(
  `Inconsistent naming conventions: ${report.inconsistentNaming.length}`
);

if (report.duplicates.length > 0) {
  console.log("\n--- DUPLICATE COMPONENTS ---");
  report.duplicates.forEach((item) => {
    console.log(`\nComponent: ${item.name}`);
    item.instances.forEach((instance) => {
      console.log(`- ${instance.directory}/${instance.name}`);
    });
  });
}

if (report.inconsistentNaming.length > 0) {
  console.log("\n--- INCONSISTENT NAMING ---");
  report.inconsistentNaming.forEach((item) => {
    console.log(`- ${item.name}: ${item.path}`);
  });
}

// Write to file
const reportJson = JSON.stringify(report, null, 2);
fs.writeFileSync(
  path.resolve(SRC_DIR, "../component-audit-results.json"),
  reportJson
);

console.log("\nAudit complete. Results saved to component-audit-results.json");

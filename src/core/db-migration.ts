import { supabase } from "@/core/api";
import fs from "fs";
import path from "path";

/**
 * Runs a SQL migration script from the migrations directory
 *
 * @param scriptName The name of the SQL file in the migrations directory (without .sql extension)
 * @returns Promise resolving to success status
 */
export async function runMigration(scriptName: string): Promise<boolean> {
  try {
    // Read the SQL script
    const scriptPath = path.join(
      process.cwd(),
      "src",
      "migrations",
      `${scriptName}.sql`
    );
    const sqlScript = fs.readFileSync(scriptPath, "utf8");

    // Execute the script with Supabase
    const { error } = await supabase.rpc("run_sql_migration", {
      sql_script: sqlScript,
    });

    if (error) {
      console.error(`Error running migration ${scriptName}:`, error);
      return false;
    }

    console.log(`Successfully ran migration: ${scriptName}`);
    return true;
  } catch (err) {
    console.error(`Failed to run migration ${scriptName}:`, err);
    return false;
  }
}

/**
 * Example usage:
 *
 * // In your application initialization
 * runMigration('shift_payment_methods')
 *   .then(success => {
 *     if (success) {
 *       console.log('Migration completed successfully');
 *     } else {
 *       console.error('Migration failed');
 *     }
 *   });
 */

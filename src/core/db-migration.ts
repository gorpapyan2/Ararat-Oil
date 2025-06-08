
import { supabase } from '@/core/api/supabase';

interface MigrationResult {
  success: boolean;
  message: string;
  data?: any;
}

export class DatabaseMigration {
  private async executeFunction(functionName: string, params?: Record<string, any>): Promise<MigrationResult> {
    try {
      const { data, error } = await supabase.rpc(functionName, params);
      
      if (error) {
        return {
          success: false,
          message: `Migration failed: ${error.message}`,
        };
      }
      
      return {
        success: true,
        message: `Migration completed successfully`,
        data,
      };
    } catch (error) {
      return {
        success: false,
        message: `Migration error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  // Remove the problematic function call and use available functions only
  async checkTableExists(tableName: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('check_table_exists', { table_name: tableName });
      return !error && data;
    } catch {
      return false;
    }
  }

  async createFuelSupply(supply: any): Promise<MigrationResult> {
    return this.executeFunction('create_fuel_supply', supply);
  }

  async updateFuelSupply(id: string, updates: any): Promise<MigrationResult> {
    return this.executeFunction('update_fuel_supply', { supply_id: id, ...updates });
  }

  async deleteFuelSupply(id: string): Promise<MigrationResult> {
    return this.executeFunction('delete_fuel_supply', { supply_id: id });
  }

  async checkEmployeeShift(employeeId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('employee_has_open_shift', { employee_id: employeeId });
      return !error && data;
    } catch {
      return false;
    }
  }

  async getShiftEmployees(shiftId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase.rpc('get_shift_employees', { shift_id: shiftId });
      return error ? [] : data || [];
    } catch {
      return [];
    }
  }

  async recordTankLevelChange(tankId: string, oldLevel: number, newLevel: number, reason: string): Promise<MigrationResult> {
    return this.executeFunction('record_tank_level_change', {
      tank_id: tankId,
      old_level: oldLevel,
      new_level: newLevel,
      change_reason: reason,
    });
  }

  async createSaleAndUpdateTank(saleData: any, tankId: string, quantity: number): Promise<MigrationResult> {
    return this.executeFunction('create_sale_and_update_tank', {
      sale_data: saleData,
      tank_id: tankId,
      quantity_sold: quantity,
    });
  }

  async deleteSaleAndRestoreTank(saleId: string): Promise<MigrationResult> {
    return this.executeFunction('delete_sale_and_restore_tank', { sale_id: saleId });
  }
}

export const dbMigration = new DatabaseMigration();

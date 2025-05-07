import { supabase } from "@/services/supabase";
import { Employee, EmployeeStatus } from "@/types";

export const fetchEmployees = async (options?: { status?: EmployeeStatus }): Promise<Employee[]> => {
  let query = supabase
    .from("employees")
    .select("*")
    .order("name", { ascending: true });

  if (options?.status) {
    query = query.eq("status", options.status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching employees:", error);
    throw new Error(`Failed to fetch employees: ${error.message}`);
  }

  return (data || []).map((employee) => ({
    ...employee,
    status: employee.status as EmployeeStatus,
  }));
};

export const createEmployee = async (
  employee: Omit<Employee, "id" | "created_at">,
): Promise<Employee> => {
  const { data, error } = await supabase
    .from("employees")
    .insert([employee])
    .select()
    .single();

  if (error) throw error;
  return {
    ...data,
    status: data.status as EmployeeStatus,
  };
};

export const updateEmployee = async (
  id: string,
  employee: Partial<Employee>,
): Promise<Employee> => {
  const { data, error } = await supabase
    .from("employees")
    .update(employee)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return {
    ...data,
    status: data.status as EmployeeStatus,
  };
};

export const deleteEmployee = async (id: string): Promise<void> => {
  const { error } = await supabase.from("employees").delete().eq("id", id);

  if (error) throw error;
};

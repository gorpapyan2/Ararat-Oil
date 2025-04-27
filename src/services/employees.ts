import { supabase } from "@/integrations/supabase/client";
import { Employee, EmployeeStatus } from "@/types";

export const fetchEmployees = async (): Promise<Employee[]> => {
  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
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

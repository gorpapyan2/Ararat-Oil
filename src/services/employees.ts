import { supabase } from "@/services/supabase";
import { Employee, EmployeeStatus } from "@/types";

// Mock data for offline mode
const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "offline-emp-1",
    name: "John Doe",
    position: "Manager",
    contact: "+374 11 123456",
    salary: 150000,
    hire_date: "2022-01-15",
    status: "active",
    created_at: new Date().toISOString()
  },
  {
    id: "offline-emp-2",
    name: "Jane Smith",
    position: "Operator",
    contact: "+374 11 654321",
    salary: 120000,
    hire_date: "2022-03-10",
    status: "active",
    created_at: new Date().toISOString()
  }
];

export const fetchEmployees = async (options?: { status?: EmployeeStatus }): Promise<Employee[]> => {
  try {
    // Check for offline status
    if (!navigator.onLine) {
      console.log("Using offline mode for employees");
      return options?.status 
        ? MOCK_EMPLOYEES.filter(emp => emp.status === options.status)
        : MOCK_EMPLOYEES;
    }

    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log("No session, using offline mode for employees");
      return options?.status 
        ? MOCK_EMPLOYEES.filter(emp => emp.status === options.status)
        : MOCK_EMPLOYEES;
    }

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
      return options?.status 
        ? MOCK_EMPLOYEES.filter(emp => emp.status === options.status)
        : MOCK_EMPLOYEES;
    }

    return (data || []).map((employee) => ({
      ...employee,
      status: employee.status as EmployeeStatus,
    }));
  } catch (err) {
    console.error("Failed to fetch employees:", err);
    console.log("Using offline mode as fallback for employees");
    return options?.status 
      ? MOCK_EMPLOYEES.filter(emp => emp.status === options.status)
      : MOCK_EMPLOYEES;
  }
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

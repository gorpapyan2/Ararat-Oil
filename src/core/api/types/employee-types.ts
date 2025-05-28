/**
 * API Employee object type
 */
export interface ApiEmployee {
  id: string;
  name: string;
  position: string;
  contact: string;
  salary: number;
  hire_date: string;
  status: string;
  created_at: string;
  updated_at?: string;
  department?: string;
}

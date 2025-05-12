import { createClient } from 'npm:@supabase/supabase-js@2.39.3';
import { corsHeaders, handleCors } from '../_shared/cors.ts';

// Types for better type safety
interface Employee {
  id: string;
  name: string;
  position: string;
  contact: string;
  salary: number;
  hire_date: string;
  status: 'active' | 'on_leave' | 'terminated';
  created_at?: string;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

console.info('Employees Edge Function started');

Deno.serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const url = new URL(req.url);
    const segments = url.pathname.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    const isCollection = lastSegment === 'employees';
    const id = (lastSegment === 'active' || isCollection) ? null : lastSegment;

    // Handle different HTTP methods
    switch (req.method) {
      case 'GET': {
        let response: ApiResponse<Employee | Employee[]>;
        
        if (lastSegment === 'active') {
          // Get active employees
          const { data, error } = await supabaseClient
            .from('employees')
            .select('*')
            .eq('status', 'active');

          if (error) throw error;
          response = { data };
        } else if (id) {
          // Get employee by ID
          const { data, error } = await supabaseClient
            .from('employees')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;
          response = { data };
        } else if (isCollection) {
          // Get all employees with optional status filter
          const status = url.searchParams.get('status');
          let query = supabaseClient.from('employees').select('*');
          
          if (status) {
            query = query.eq('status', status);
          }

          const { data, error } = await query;
          if (error) throw error;
          response = { data };
        }

        return new Response(
          JSON.stringify(response),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      }

      case 'POST': {
        // Create new employee
        const createData: Omit<Employee, 'id' | 'created_at'> = await req.json();
        
        // Validate required fields
        if (!createData.name || !createData.position || !createData.contact) {
          throw new Error('Missing required fields: name, position, and contact are required');
        }

        const { data, error } = await supabaseClient
          .from('employees')
          .insert(createData)
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ data }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 201,
          }
        );
      }

      case 'PUT': {
        if (!id) {
          throw new Error('Employee ID is required for update');
        }

        // Update employee
        const updateData: Partial<Employee> = await req.json();
        
        // Validate that we're not trying to update protected fields
        if ('id' in updateData || 'created_at' in updateData) {
          throw new Error('Cannot update protected fields: id, created_at');
        }

        const { data, error } = await supabaseClient
          .from('employees')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ data }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      }

      case 'DELETE': {
        if (!id) {
          throw new Error('Employee ID is required for deletion');
        }

        // Delete employee
        const { error } = await supabaseClient
          .from('employees')
          .delete()
          .eq('id', id);

        if (error) throw error;

        return new Response(
          JSON.stringify({ data: null }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 204,
          }
        );
      }

      default:
        throw new Error(`Method ${req.method} not allowed`);
    }
  } catch (error) {
    console.error('Employees function error:', error);
    
    // Determine appropriate status code
    const status = error.message.includes('not allowed') ? 405 : 
                  error.message.includes('required') ? 400 : 500;
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status,
      }
    );
  }
}); 
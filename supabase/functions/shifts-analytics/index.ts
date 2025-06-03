import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ShiftRequest {
  action: string;
  shift_id?: string;
  employee_id?: string;
  date_range?: {
    start: string;
    end: string;
  };
  status?: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  hourly_rate: number;
  phone: string;
  avatar_url?: string;
  status: 'active' | 'inactive' | 'on_shift';
  hire_date: string;
  performance_rating: number;
}

interface Shift {
  id: string;
  employee_id: string;
  employee_name: string;
  start_time: string;
  end_time: string;
  scheduled_hours: number;
  actual_hours: number;
  break_duration: number;
  status: 'scheduled' | 'active' | 'completed' | 'missed' | 'cancelled';
  position: string;
  notes?: string;
  clock_in_time?: string;
  clock_out_time?: string;
  overtime_hours: number;
  total_pay: number;
  shift_rating?: number;
}

interface ShiftMetrics {
  total_employees: number;
  employees_on_shift: number;
  scheduled_shifts_today: number;
  completed_shifts_today: number;
  attendance_rate: number;
  average_hours_per_employee: number;
  overtime_hours_this_week: number;
  total_labor_cost_today: number;
  shift_coverage: number;
  no_show_rate: number;
  average_shift_rating: number;
  labor_efficiency: number;
}

// Mock data generators
function generateEmployees(): Employee[] {
  return [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@company.com',
      role: 'Manager',
      hourly_rate: 25.00,
      phone: '+1-555-0101',
      status: 'on_shift',
      hire_date: '2023-01-15',
      performance_rating: 4.8
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'Cashier',
      hourly_rate: 18.50,
      phone: '+1-555-0102',
      status: 'active',
      hire_date: '2023-03-22',
      performance_rating: 4.6
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike.wilson@company.com',
      role: 'Maintenance',
      hourly_rate: 22.00,
      phone: '+1-555-0103',
      status: 'on_shift',
      hire_date: '2022-11-08',
      performance_rating: 4.9
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      role: 'Attendant',
      hourly_rate: 16.75,
      phone: '+1-555-0104',
      status: 'active',
      hire_date: '2023-06-12',
      performance_rating: 4.3
    },
    {
      id: '5',
      name: 'David Brown',
      email: 'david.brown@company.com',
      role: 'Attendant',
      hourly_rate: 17.25,
      phone: '+1-555-0105',
      status: 'inactive',
      hire_date: '2023-02-28',
      performance_rating: 3.8
    }
  ];
}

function generateShifts(): Shift[] {
  const today = new Date();
  const shifts = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i - 3);
    
    shifts.push(
      {
        id: `shift-${i * 3 + 1}`,
        employee_id: '1',
        employee_name: 'John Smith',
        start_time: `${date.toISOString().split('T')[0]}T06:00:00Z`,
        end_time: `${date.toISOString().split('T')[0]}T14:00:00Z`,
        scheduled_hours: 8,
        actual_hours: 8.5,
        break_duration: 0.5,
        status: i < 3 ? 'completed' : i === 3 ? 'active' : 'scheduled',
        position: 'Manager',
        overtime_hours: 0.5,
        total_pay: 212.50,
        shift_rating: 4.8
      },
      {
        id: `shift-${i * 3 + 2}`,
        employee_id: '2',
        employee_name: 'Sarah Johnson',
        start_time: `${date.toISOString().split('T')[0]}T14:00:00Z`,
        end_time: `${date.toISOString().split('T')[0]}T22:00:00Z`,
        scheduled_hours: 8,
        actual_hours: i < 3 ? 8 : 0,
        break_duration: 0.5,
        status: i < 3 ? 'completed' : i === 3 ? 'active' : 'scheduled',
        position: 'Cashier',
        overtime_hours: 0,
        total_pay: 148.00,
        shift_rating: 4.6
      },
      {
        id: `shift-${i * 3 + 3}`,
        employee_id: '3',
        employee_name: 'Mike Wilson',
        start_time: `${date.toISOString().split('T')[0]}T22:00:00Z`,
        end_time: `${new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}T06:00:00Z`,
        scheduled_hours: 8,
        actual_hours: i < 3 ? 8 : 0,
        break_duration: 0.5,
        status: i < 3 ? 'completed' : i === 3 ? 'scheduled' : 'scheduled',
        position: 'Maintenance',
        overtime_hours: 0,
        total_pay: 176.00,
        shift_rating: 4.9
      }
    );
  }
  
  return shifts;
}

function generateShiftMetrics(): ShiftMetrics {
  return {
    total_employees: 5,
    employees_on_shift: 2,
    scheduled_shifts_today: 3,
    completed_shifts_today: 2,
    attendance_rate: 94.5,
    average_hours_per_employee: 38.2,
    overtime_hours_this_week: 4.5,
    total_labor_cost_today: 536.50,
    shift_coverage: 88.7,
    no_show_rate: 2.1,
    average_shift_rating: 4.7,
    labor_efficiency: 92.3
  };
}

function generateShiftAnalytics() {
  const now = new Date();
  const weeklyData = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    weeklyData.push({
      date: date.toISOString().split('T')[0],
      scheduled_shifts: Math.floor(Math.random() * 5) + 8,
      completed_shifts: Math.floor(Math.random() * 4) + 7,
      total_hours: Math.floor(Math.random() * 20) + 60,
      labor_cost: Math.floor(Math.random() * 500) + 800,
      attendance_rate: Math.floor(Math.random() * 10) + 85
    });
  }

  return {
    weekly_schedule: weeklyData,
    employee_performance: [
      {
        employee_id: '1',
        name: 'John Smith',
        attendance_rate: 98.5,
        average_rating: 4.8,
        total_hours: 42,
        overtime_hours: 2,
        punctuality_score: 95
      },
      {
        employee_id: '2',
        name: 'Sarah Johnson',
        attendance_rate: 94.2,
        average_rating: 4.6,
        total_hours: 38,
        overtime_hours: 0,
        punctuality_score: 92
      },
      {
        employee_id: '3',
        name: 'Mike Wilson',
        attendance_rate: 96.8,
        average_rating: 4.9,
        total_hours: 40,
        overtime_hours: 1.5,
        punctuality_score: 98
      }
    ],
    shift_patterns: {
      morning: { shifts: 21, attendance: 96.2 },
      afternoon: { shifts: 21, attendance: 93.8 },
      night: { shifts: 21, attendance: 89.4 }
    },
    peak_hours: [
      { hour: 7, coverage: 3, required: 3 },
      { hour: 8, coverage: 3, required: 4 },
      { hour: 12, coverage: 4, required: 4 },
      { hour: 17, coverage: 3, required: 4 },
      { hour: 18, coverage: 3, required: 3 }
    ]
  };
}

function generatePayrollSummary() {
  return {
    current_pay_period: {
      start_date: '2024-01-01',
      end_date: '2024-01-14',
      total_regular_hours: 320,
      total_overtime_hours: 12,
      total_gross_pay: 6840.50,
      total_deductions: 1368.10,
      total_net_pay: 5472.40
    },
    employee_payroll: [
      {
        employee_id: '1',
        name: 'John Smith',
        regular_hours: 80,
        overtime_hours: 4,
        gross_pay: 2100.00,
        deductions: 420.00,
        net_pay: 1680.00
      },
      {
        employee_id: '2',
        name: 'Sarah Johnson',
        regular_hours: 80,
        overtime_hours: 0,
        gross_pay: 1480.00,
        deductions: 296.00,
        net_pay: 1184.00
      },
      {
        employee_id: '3',
        name: 'Mike Wilson',
        regular_hours: 80,
        overtime_hours: 3,
        gross_pay: 1859.00,
        deductions: 371.80,
        net_pay: 1487.20
      }
    ],
    labor_cost_breakdown: {
      regular_pay: 5760.00,
      overtime_pay: 1080.50,
      benefits: 684.05,
      taxes: 1368.10,
      total: 8892.65
    }
  };
}

function generateScheduleOptimization() {
  return {
    recommendations: [
      {
        type: 'understaffed',
        time_slot: '2024-01-16 08:00-10:00',
        current_staff: 2,
        recommended_staff: 3,
        suggested_action: 'Add morning shift attendant',
        priority: 'high'
      },
      {
        type: 'overstaffed',
        time_slot: '2024-01-17 02:00-06:00',
        current_staff: 2,
        recommended_staff: 1,
        suggested_action: 'Reduce night shift coverage',
        priority: 'medium'
      },
      {
        type: 'skill_gap',
        time_slot: '2024-01-18 14:00-22:00',
        current_staff: 2,
        recommended_staff: 2,
        suggested_action: 'Ensure maintenance-qualified staff',
        priority: 'high'
      }
    ],
    cost_savings: {
      potential_weekly_savings: 450.00,
      efficiency_improvements: 8.5,
      optimal_schedule_adherence: 94.2
    },
    coverage_gaps: [
      {
        date: '2024-01-20',
        time: '06:00-08:00',
        position: 'Manager',
        urgency: 'critical'
      },
      {
        date: '2024-01-21',
        time: '22:00-06:00',
        position: 'Attendant',
        urgency: 'moderate'
      }
    ]
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, shift_id, employee_id, date_range, status }: ShiftRequest = await req.json();

    let response;

    switch (action) {
      case 'get_metrics':
        response = generateShiftMetrics();
        break;
        
      case 'get_employees':
        response = generateEmployees();
        break;
        
      case 'get_shifts':
        response = generateShifts();
        break;
        
      case 'get_analytics':
        response = generateShiftAnalytics();
        break;
        
      case 'get_payroll_summary':
        response = generatePayrollSummary();
        break;
        
      case 'get_schedule_optimization':
        response = generateScheduleOptimization();
        break;
        
      case 'clock_in':
        response = {
          success: true,
          employee_id,
          clock_in_time: new Date().toISOString(),
          message: 'Successfully clocked in'
        };
        break;
        
      case 'clock_out':
        response = {
          success: true,
          employee_id,
          clock_out_time: new Date().toISOString(),
          total_hours: 8.5,
          overtime_hours: 0.5,
          message: 'Successfully clocked out'
        };
        break;
        
      case 'update_shift':
        response = {
          success: true,
          shift_id,
          message: 'Shift updated successfully'
        };
        break;
        
      case 'create_shift':
        response = {
          success: true,
          shift_id: `shift-${Date.now()}`,
          message: 'Shift created successfully'
        };
        break;
        
      case 'get_employee_schedule':
        response = {
          employee_id,
          upcoming_shifts: generateShifts().filter(shift => 
            shift.employee_id === employee_id && 
            shift.status === 'scheduled'
          ).slice(0, 5),
          total_scheduled_hours: 40,
          overtime_hours: 2.5
        };
        break;
        
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Shifts analytics error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}); 
import { fetchJson } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/config/api';
import type { DashboardData } from '@/core/api/types';

// Fallback dashboard data structure
const DEFAULT_DASHBOARD_DATA: DashboardData = {
  fuel_levels: {},
  recent_sales: [],
  revenue_summary: {
    daily: 0,
    weekly: 0,
    monthly: 0
  },
  inventory_status: {
    total_capacity: 0,
    current_level: 0,
    percentage: 0
  }
};

export async function fetchDashboardData(): Promise<DashboardData> {
  try {
    console.log('🚀 Fetching dashboard data from Supabase Edge Function...');
    
    // Call the Supabase Edge Function
    const response = await fetchJson<DashboardData>(API_ENDPOINTS.FUNCTIONS.DASHBOARD);
    
    if (response.error) {
      console.warn('⚠️ Dashboard Edge Function returned error:', response.error);
      return DEFAULT_DASHBOARD_DATA;
    }
    
    if (!response.data) {
      console.warn('⚠️ Dashboard Edge Function returned no data');
      return DEFAULT_DASHBOARD_DATA;
    }
    
    console.log('✅ Dashboard data fetched successfully from Edge Function');
    return response.data;
    
  } catch (error) {
    console.error('❌ Dashboard Edge Function failed:', error);
    console.log('🔧 Using default dashboard data structure');
    return DEFAULT_DASHBOARD_DATA;
  }
} 
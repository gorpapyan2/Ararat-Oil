// This file contains utility functions for checking Supabase connection status

import { supabase } from "@/integrations/supabase/client";
import { QueryClient } from "@tanstack/react-query";

/**
 * Checks if the Supabase connection is working by making a simple query
 * @returns Promise<boolean> True if connection is working, false otherwise
 */
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    console.log("Checking Supabase connection...");
    const { data, error } = await supabase.from("fuel_supplies").select("count").limit(1);
    
    if (error) {
      console.error("Supabase connection error:", error.message);
      return false;
    }
    
    console.log("Supabase connection successful");
    return true;
  } catch (e) {
    console.error("Exception checking Supabase connection:", e);
    return false;
  }
}

/**
 * List of all query keys used in the application
 * Add new keys here when creating new queries
 */
export const QUERY_KEYS = [
  'fuel-supplies',
  'petrol-providers',
  'fuel-tanks',
  'employees',
  'transactions',
  'expenses',
  'sales',
  'filling-systems'
];

/**
 * Runs a sync operation to ensure local data is up to date with Supabase
 * @param queryClient Optional QueryClient to invalidate queries
 * @returns Promise<{success: boolean, message: string}>
 */
export async function syncWithSupabase(queryClient?: QueryClient): Promise<{success: boolean, message: string, refreshedResources?: string[]}> {
  try {
    // Check connection first
    const isConnected = await checkSupabaseConnection();
    if (!isConnected) {
      return {
        success: false,
        message: "Failed to connect to Supabase. Check your internet connection and credentials."
      };
    }
    
    // Array to track which resources were refreshed
    const refreshedResources: string[] = [];
    
    // If we have a queryClient, invalidate all queries to force fresh data
    if (queryClient) {
      // Invalidate specific resources
      for (const key of QUERY_KEYS) {
        queryClient.invalidateQueries({ queryKey: [key] });
        refreshedResources.push(key);
      }
      
      console.log(`Invalidated queries for resources: ${refreshedResources.join(', ')}`);
    }
    
    return {
      success: true,
      message: queryClient 
        ? `Successfully synced with Supabase. Refreshed ${refreshedResources.length} resources.`
        : "Successfully connected to Supabase.",
      refreshedResources: refreshedResources
    };
  } catch (e) {
    console.error("Error syncing with Supabase:", e);
    return {
      success: false,
      message: `Error syncing with Supabase: ${e instanceof Error ? e.message : String(e)}`
    };
  }
} 
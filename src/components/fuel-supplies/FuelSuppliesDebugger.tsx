import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { testSupabaseConnection } from "@/utils/debug-utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export function FuelSuppliesDebugger() {
  const [results, setResults] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  
  const runConnectionTest = async () => {
    setIsLoading(true);
    setResults(null);
    
    try {
      const success = await testSupabaseConnection();
      if (success) {
        setResults({
          success: true,
          message: "Supabase connection test passed successfully"
        });
      } else {
        setResults({
          success: false,
          message: "Connection test failed. Check console for details."
        });
      }
    } catch (error) {
      setResults({
        success: false,
        message: "Error running connection test",
        details: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const runDirectFuelSuppliesQuery = async () => {
    setIsLoading(true);
    setResults(null);
    
    try {
      // First test basic connection
      const { data: testData, error: testError } = await supabase
        .from("fuel_supplies")
        .select("count")
        .limit(1);
        
      if (testError) {
        setResults({
          success: false,
          message: "Basic connection test failed",
          details: testError
        });
        setIsLoading(false);
        return;
      }
      
      // Now test the full query with relations
      const { data, error } = await supabase
        .from("fuel_supplies")
        .select(`
          *,
          provider:petrol_providers!provider_id(id, name, contact),
          tank:fuel_tanks!tank_id(id, name, fuel_type, capacity, current_level),
          employee:employees!employee_id(id, name, position, contact, salary, hire_date, status)
        `)
        .order("delivery_date", { ascending: false })
        .limit(3);
        
      if (error) {
        setResults({
          success: false,
          message: "Full query failed",
          details: error
        });
      } else if (!data || data.length === 0) {
        setResults({
          success: false,
          message: "Query succeeded but no data returned",
          details: { data }
        });
      } else {
        setResults({
          success: true,
          message: `Successfully retrieved ${data.length} fuel supplies`,
          details: {
            sampleData: data[0],
            hasProvider: Boolean(data[0]?.provider),
            hasTank: Boolean(data[0]?.tank),
            hasEmployee: Boolean(data[0]?.employee)
          }
        });
      }
    } catch (error) {
      setResults({
        success: false,
        message: "Exception during query",
        details: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="mb-6 bg-muted/20">
      <CardHeader>
        <CardTitle className="text-red-500">Debug Panel</CardTitle>
        <CardDescription>
          Testing tools for diagnosing Supabase connection issues
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={runConnectionTest} 
            disabled={isLoading}
          >
            Test Supabase Connection
          </Button>
          <Button 
            variant="outline" 
            onClick={runDirectFuelSuppliesQuery} 
            disabled={isLoading}
          >
            Direct Fuel Supplies Query
          </Button>
        </div>
        
        {isLoading && <div className="text-center py-4">Testing connection...</div>}
        
        {results && (
          <div className={`mt-4 p-4 rounded-md ${results.success ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'}`}>
            <div className="flex items-center gap-2">
              {results.success ? (
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              ) : (
                <AlertCircle className="h-6 w-6 text-red-600" />
              )}
              <span className="font-medium">{results.message}</span>
            </div>
            
            {results.details && (
              <div className="mt-2 text-sm">
                <div className="font-semibold">Details:</div>
                <pre className="mt-1 p-2 bg-black/10 rounded overflow-auto max-h-60 text-xs">
                  {JSON.stringify(results.details, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Remove this component before deploying to production
      </CardFooter>
    </Card>
  );
} 
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchFuelTanks } from "@/services/tanks";
import { validateTankIds } from "@/services/filling-systems";
import { supabase } from "@/integrations/supabase/client";

export function TankDiagnostics() {
  const [isOpen, setIsOpen] = useState(false);
  const [tanks, setTanks] = useState<any[]>([]);
  const [fillingSystems, setFillingSystems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [validationResults, setValidationResults] = useState<Record<string, boolean>>({});

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      // Fetch tanks directly
      const tanksData = await fetchFuelTanks();
      setTanks(tanksData);
      
      // Fetch filling systems with raw query
      const { data: systems, error } = await supabase
        .from('filling_systems')
        .select('*');
        
      if (error) {
        console.error('Error fetching filling systems:', error);
        throw error;
      }
      
      setFillingSystems(systems || []);
      
      // Validate tank IDs
      if (systems && systems.length > 0) {
        const tankIds = systems
          .map((system: any) => system.tank_id)
          .filter((id: string) => id != null && id !== '');
          
        const validations = await validateTankIds(tankIds);
        setValidationResults(validations);
      }
    } catch (err) {
      console.error('Diagnostics error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <Button 
        onClick={() => setIsOpen(!isOpen)} 
        variant="outline"
        className="mb-4"
      >
        {isOpen ? "Hide Diagnostics" : "Show Diagnostics"}
      </Button>
      
      {isOpen && (
        <div className="space-y-4">
          <Button 
            onClick={runDiagnostics} 
            disabled={loading}
            variant="secondary"
          >
            {loading ? "Running..." : "Run Tank Diagnostics"}
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Fuel Tanks ({tanks.length})</CardTitle>
              </CardHeader>
              <CardContent className="max-h-96 overflow-auto">
                <pre className="text-xs">{JSON.stringify(tanks, null, 2)}</pre>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Filling Systems ({fillingSystems.length})</CardTitle>
              </CardHeader>
              <CardContent className="max-h-96 overflow-auto">
                <pre className="text-xs">{JSON.stringify(fillingSystems, null, 2)}</pre>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Tank ID Validation Results</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 text-left">System Name</th>
                      <th className="border p-2 text-left">Tank ID</th>
                      <th className="border p-2 text-left">Tank Exists</th>
                      <th className="border p-2 text-left">Problem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fillingSystems.map((system: any) => {
                      const tankExists = system.tank_id ? validationResults[system.tank_id] : false;
                      const problem = !system.tank_id 
                        ? "No tank ID assigned" 
                        : !tankExists 
                          ? "Tank ID does not exist in database" 
                          : "";
                          
                      return (
                        <tr key={system.id} className={problem ? "bg-red-950/20" : ""}>
                          <td className="border p-2">{system.name}</td>
                          <td className="border p-2">{system.tank_id || "—"}</td>
                          <td className="border p-2">
                            {system.tank_id 
                              ? (tankExists 
                                ? "✅ Yes" 
                                : "❌ No") 
                              : "—"}
                          </td>
                          <td className="border p-2 text-red-400">{problem}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
} 
import { useState } from "react";
import { Button } from "@/core/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { tanksApi } from "@/core/api";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { useFillingSystem } from "../hooks/useFillingSystem";

export function TankDiagnostics() {
  const { t } = useTranslation();
  const { validateTankIds } = useFillingSystem();
  const [isOpen, setIsOpen] = useState(false);
  const [tanks, setTanks] = useState<any[]>([]);
  const [fillingSystems, setFillingSystems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [validationResults, setValidationResults] = useState<
    Record<string, boolean>
  >({});

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      // Fetch tanks directly
      const tanksData = await tanksApi.getTanks();
      setTanks(tanksData.data || []);

      // Fetch filling systems with raw query
      const { data: systems, error } = await supabase
        .from("filling_systems")
        .select("*");

      if (error) {
        console.error("Error fetching filling systems:", error);
        throw error;
      }

      setFillingSystems(systems || []);

      // Validate tank IDs
      if (systems && systems.length > 0) {
        const tankIds = systems
          .map((system: any) => system.tank_id)
          .filter((id: string) => id != null && id !== "");

        // Use validateTankIds function from our hook
        const validations = await validateTankIds(tankIds);
        setValidationResults(
          tankIds.reduce((acc: Record<string, boolean>, id: string) => {
            acc[id] = !validations.invalidIds?.includes(id);
            return acc;
          }, {})
        );
      }
    } catch (err) {
      console.error("Diagnostics error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get translated text or fallback to default values
  const showDiagnostics = t("fillingSystems.showDiagnostics") || "Show Diagnostics";
  const hideDiagnostics = t("fillingSystems.hideDiagnostics") || "Hide Diagnostics";
  const runDiagnosticsText = t("fillingSystems.runTankDiagnostics") || "Run Tank Diagnostics";
  const runningText = t("common.running") || "Running...";
  const fuelTanksText = t("fillingSystems.fuelTanks") || "Fuel Tanks";
  const fillingSystemsText = t("fillingSystems.fillingSystems") || "Filling Systems";
  const validationResultsText = t("fillingSystems.tankIdValidationResults") || "Tank ID Validation Results";
  const systemNameText = t("fillingSystems.systemName") || "System Name";
  const tankIdText = t("fillingSystems.tankId") || "Tank ID";
  const tankExistsText = t("fillingSystems.tankExists") || "Tank Exists";
  const problemText = t("fillingSystems.problem") || "Problem";
  const noTankIdText = t("fillingSystems.noTankIdAssigned") || "No tank ID assigned";
  const tankNotExistText = t("fillingSystems.tankIdNotExist") || "Tank ID does not exist in database";
  const yesText = t("common.yes") || "Yes";
  const noText = t("common.no") || "No";

  return (
    <div className="mt-8">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="mb-4"
      >
        {isOpen ? hideDiagnostics : showDiagnostics}
      </Button>

      {isOpen && (
        <div className="space-y-4">
          <Button
            onClick={runDiagnostics}
            disabled={loading}
            variant="secondary"
          >
            {loading ? runningText : runDiagnosticsText}
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{fuelTanksText} ({tanks.length})</CardTitle>
              </CardHeader>
              <CardContent className="max-h-96 overflow-auto">
                <pre className="text-xs">{JSON.stringify(tanks, null, 2)}</pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{fillingSystemsText} ({fillingSystems.length})</CardTitle>
              </CardHeader>
              <CardContent className="max-h-96 overflow-auto">
                <pre className="text-xs">
                  {JSON.stringify(fillingSystems, null, 2)}
                </pre>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{validationResultsText}</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 text-left">{systemNameText}</th>
                      <th className="border p-2 text-left">{tankIdText}</th>
                      <th className="border p-2 text-left">{tankExistsText}</th>
                      <th className="border p-2 text-left">{problemText}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fillingSystems.map((system: any) => {
                      const tankExists = system.tank_id
                        ? validationResults[system.tank_id]
                        : false;
                      const problem = !system.tank_id
                        ? noTankIdText
                        : !tankExists
                          ? tankNotExistText
                          : "";

                      return (
                        <tr
                          key={system.id}
                          className={problem ? "bg-red-950/20" : ""}
                        >
                          <td className="border p-2">{system.name}</td>
                          <td className="border p-2">
                            {system.tank_id || "—"}
                          </td>
                          <td className="border p-2">
                            {system.tank_id
                              ? tankExists
                                ? `✅ ${yesText}`
                                : `❌ ${noText}`
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
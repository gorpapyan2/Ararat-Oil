
import { ShiftControl } from "@/components/sales/ShiftControl";
import { PageLayout } from "@/layouts/PageLayout";
import { ChartBar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Shift } from "@/types";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fetchEmployeeByUserId, fetchShiftHistory } from "@/utils/api-helpers";

interface ShiftHistoryItem extends Omit<Shift, 'sales_total' | 'status'> {
  sales_total: number | null;
  employee_name: string;
  status: 'OPEN' | 'CLOSED';
}

// Helper function to format dates
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

const Shifts = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [shiftHistory, setShiftHistory] = useState<ShiftHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadShiftHistory();
    }
  }, [user]);

  const loadShiftHistory = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    try {
      // First, get the employee name
      const employee = await fetchEmployeeByUserId(user.id);
      const employeeName = employee && typeof employee === 'object' ? (employee as any).name || 'Current User' : 'Current User';
      
      // Then get shift history
      const shifts = await fetchShiftHistory(user.id);
      
      // Format the data for display
      const formattedData = shifts.map(shift => ({
        ...shift,
        employee_name: employeeName,
        status: shift.status as 'OPEN' | 'CLOSED'
      }));
      
      setShiftHistory(formattedData as ShiftHistoryItem[]);
    } catch (error: any) {
      console.error('Error loading shift history:', error);
      setError(error.message || 'Failed to load shift history');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout
      titleKey="common.shifts"
      descriptionKey="shifts.description"
      icon={ChartBar}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium">{t("shifts.currentShift")}</h2>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{t("shifts.shiftControl")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ShiftControl />
          </CardContent>
        </Card>
        
        <div className="mt-8">
          <h2 className="text-xl font-medium mb-4">{t("shifts.recentShifts")}</h2>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t("common.error")}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : shiftHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">{t("common.noData")}</div>
          ) : (
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left">{t("common.date")}</th>
                      <th className="px-4 py-3 text-left">{t("shifts.startTime")}</th>
                      <th className="px-4 py-3 text-left">{t("shifts.endTime")}</th>
                      <th className="px-4 py-3 text-left">{t("shifts.openingCash")}</th>
                      <th className="px-4 py-3 text-left">{t("shifts.closingCash")}</th>
                      <th className="px-4 py-3 text-left">{t("shifts.totalSales")}</th>
                      <th className="px-4 py-3 text-left">{t("common.status")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shiftHistory.map((shift) => (
                      <tr key={shift.id} className="border-b">
                        <td className="px-4 py-3">{formatDate(shift.created_at || shift.start_time)}</td>
                        <td className="px-4 py-3">{new Date(shift.created_at || shift.start_time).toLocaleTimeString()}</td>
                        <td className="px-4 py-3">
                          {shift.end_time ? new Date(shift.end_time).toLocaleTimeString() : '-'}
                        </td>
                        <td className="px-4 py-3">{formatCurrency(shift.opening_cash)}</td>
                        <td className="px-4 py-3">
                          {shift.closing_cash !== null ? formatCurrency(shift.closing_cash) : '-'}
                        </td>
                        <td className="px-4 py-3">{formatCurrency(shift.sales_total || 0)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            shift.status === 'OPEN' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                          }`}>
                            {shift.status === 'OPEN' ? t("shifts.open") : t("shifts.closed")}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

export default Shifts; 

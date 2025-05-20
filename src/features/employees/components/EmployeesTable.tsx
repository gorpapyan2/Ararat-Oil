import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/badge";
import { PencilIcon, TrashIcon } from "lucide-react";
import { formatDate } from "@/utils/date";

interface Employee {
  id: string;
  name: string;
  position: string;
  hire_date?: string;
  contact?: string;
  status?: 'active' | 'inactive' | 'on_leave';
}

interface EmployeesTableProps {
  employees: Employee[];
  onEdit?: (employee: Employee) => void;
  onDelete?: (employee: Employee) => void;
  isLoading?: boolean;
}

function EmployeesTable({
  employees,
  onEdit,
  onDelete,
  isLoading = false,
}: EmployeesTableProps) {
  const { t } = useTranslation();
  
  // Format status badge
  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case 'on_leave':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">On Leave</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("employees.employeesList", "Employees List")}
        </CardTitle>
        <CardDescription>
          {t("employees.totalCount", "Total {{count}} employees", { count: employees.length })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">
            {t("common.loading", "Loading...")}
          </div>
        ) : employees.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            {t("employees.noEmployees", "No employees found")}
          </div>
        ) : (
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("common.name", "Name")}</TableHead>
                  <TableHead>{t("employees.position", "Position")}</TableHead>
                  <TableHead>{t("employees.hireDate", "Hire Date")}</TableHead>
                  <TableHead>{t("common.contact", "Contact")}</TableHead>
                  <TableHead>{t("common.status", "Status")}</TableHead>
                  <TableHead className="text-right">{t("common.actions", "Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>
                      {employee.hire_date ? formatDate(employee.hire_date) : "-"}
                    </TableCell>
                    <TableCell>{employee.contact || "-"}</TableCell>
                    <TableCell>{getStatusBadge(employee.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(employee)}
                            aria-label={t("common.edit", "Edit")}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(employee)}
                            aria-label={t("common.delete", "Delete")}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { EmployeesTable };
export default EmployeesTable; 
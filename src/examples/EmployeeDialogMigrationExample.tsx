import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit } from "lucide-react";
import { Employee } from "@/types";
import { EmployeeDialog } from "@/components/employees/EmployeeDialog";
import { EmployeeDialogStandardized } from "@/components/employees/EmployeeDialogStandardized";
import { EmployeeDialogHooked, useEmployeeDialog } from "@/components/employees/EmployeeDialogHooked";

// Sample employee data for demonstration
const sampleEmployee: Employee = {
  id: "1",
  name: "Jane Smith",
  position: "Manager",
  contact: "jane.smith@example.com",
  hire_date: "2022-01-15",
  salary: 75000,
  status: "active",
  created_at: "2022-01-15T12:00:00Z",
  updated_at: "2023-03-10T09:15:00Z",
};

export function EmployeeDialogMigrationExample() {
  const [activeTab, setActiveTab] = useState("original");
  
  // State for the original dialog
  const [originalOpen, setOriginalOpen] = useState(false);
  const [originalEmployee, setOriginalEmployee] = useState<Employee | null>(null);
  
  // State for the standardized dialog
  const [standardizedOpen, setStandardizedOpen] = useState(false);
  const [standardizedEmployee, setStandardizedEmployee] = useState<Employee | null>(null);
  
  // Use the custom hook for the hooked dialog
  const employeeDialog = useEmployeeDialog({
    onCreateSuccess: (employee) => {
      console.log("Employee created:", employee);
    },
    onUpdateSuccess: (employee) => {
      console.log("Employee updated:", employee);
    },
  });
  
  // Dialog handlers
  const handleCreateOriginal = () => {
    setOriginalEmployee(null);
    setOriginalOpen(true);
  };
  
  const handleEditOriginal = () => {
    setOriginalEmployee(sampleEmployee);
    setOriginalOpen(true);
  };
  
  const handleCreateStandardized = () => {
    setStandardizedEmployee(null);
    setStandardizedOpen(true);
  };
  
  const handleEditStandardized = () => {
    setStandardizedEmployee(sampleEmployee);
    setStandardizedOpen(true);
  };
  
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-8">Employee Dialog Migration Example</h1>
      
      <div className="mb-8 p-4 bg-muted rounded-md">
        <h2 className="text-lg font-semibold mb-2">Migration Benefits</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Improved Dialog Structure:</strong> Using StandardDialog instead of nested components
          </li>
          <li>
            <strong>Enhanced Form Validation:</strong> Zod schema validation with clear error messages
          </li>
          <li>
            <strong>State Management:</strong> 
              <ul className="list-disc pl-5 mt-1">
                <li>Level 1: Direct component props</li>
                <li>Level 2: StandardDialog with react-hook-form</li>
                <li>Level 3: Custom hook (useEmployeeDialog) with full state management</li>
              </ul>
          </li>
          <li>
            <strong>Accessibility:</strong> Proper focus management, keyboard navigation, and ARIA attributes
          </li>
          <li>
            <strong>Progressive Enhancement:</strong> Each migration step builds on the previous one
          </li>
        </ul>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="original">Original</TabsTrigger>
          <TabsTrigger value="standardized">Standardized</TabsTrigger>
          <TabsTrigger value="hooked">With Custom Hook</TabsTrigger>
        </TabsList>
        
        <TabsContent value="original" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Original EmployeeDialog</CardTitle>
              <CardDescription>
                Uses the original dialog components structure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Button onClick={handleCreateOriginal}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Employee
                </Button>
                <Button variant="outline" onClick={handleEditOriginal}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Sample Employee
                </Button>
              </div>
              
              <EmployeeDialog
                open={originalOpen}
                onOpenChange={setOriginalOpen}
                employee={originalEmployee}
                onSubmit={(data) => {
                  console.log("Original dialog submitted:", data);
                  setOriginalOpen(false);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="standardized" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Standardized EmployeeDialog</CardTitle>
              <CardDescription>
                Uses the StandardDialog component with form hooks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Button onClick={handleCreateStandardized}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Employee
                </Button>
                <Button variant="outline" onClick={handleEditStandardized}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Sample Employee
                </Button>
              </div>
              
              <EmployeeDialogStandardized
                open={standardizedOpen}
                onOpenChange={setStandardizedOpen}
                employee={standardizedEmployee}
                onSubmit={(data) => {
                  console.log("Standardized dialog submitted:", data);
                  setStandardizedOpen(false);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="hooked" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Hooked EmployeeDialog</CardTitle>
              <CardDescription>
                Uses StandardDialog with custom useEmployeeDialog hook
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Button onClick={employeeDialog.openCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Employee
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => employeeDialog.openEdit(sampleEmployee)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Sample Employee
                </Button>
              </div>
              
              <EmployeeDialogHooked 
                onCreateSuccess={(employee) => console.log("Employee created in example:", employee)}
                onUpdateSuccess={(employee) => console.log("Employee updated in example:", employee)}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dialog Structure Evolution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Original Dialog</h3>
              <pre className="bg-muted p-2 rounded text-xs overflow-x-auto mt-2">
{`<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>
        {employee ? "Edit Employee" : "Add New Employee"}
      </DialogTitle>
    </DialogHeader>
    <Form {...form}>
      {/* Form content */}
    </Form>
  </DialogContent>
</Dialog>`}
              </pre>
            </div>
            
            <div>
              <h3 className="font-medium">StandardDialog</h3>
              <pre className="bg-muted p-2 rounded text-xs overflow-x-auto mt-2">
{`<StandardDialog
  open={open}
  onOpenChange={onOpenChange}
  title={employee ? "Edit Employee" : "Add New Employee"}
  description="Update employee information"
  maxWidth="sm:max-w-[425px]"
  actions={formActions}
>
  <form onSubmit={handleSubmit}>
    {/* Form content */}
  </form>
</StandardDialog>`}
              </pre>
            </div>
            
            <div>
              <h3 className="font-medium">Hook-Enhanced Dialog</h3>
              <pre className="bg-muted p-2 rounded text-xs overflow-x-auto mt-2">
{`// In component:
const employeeDialog = useEmployeeDialog({
  onCreateSuccess,
  onUpdateSuccess
});

// In parent:
<Button onClick={employeeDialog.openCreate}>
  Create Employee
</Button>`}
              </pre>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Implementation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Code Reduction</h3>
              <ul className="list-disc pl-5 mt-2">
                <li>Original Employee Dialog: ~215 lines</li>
                <li>Standardized Employee Dialog: ~185 lines (-14%)</li>
                <li>With custom hook pattern: Dialog ~110 lines + Hook ~120 lines</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                While total code is similar, the hook pattern enables reuse across multiple components
                and provides better separation of concerns.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">Accessibility Improvements</h3>
              <ul className="list-disc pl-5 mt-2">
                <li>Focus management for keyboard users</li>
                <li>Proper ARIA attributes for screen readers</li>
                <li>Keyboard navigation with Tab trapping</li>
                <li>Escape key support</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium">State Management Benefits</h3>
              <p className="text-sm mt-2">
                The hook-based approach simplifies parent components by:
              </p>
              <ul className="list-disc pl-5 mt-1 text-sm">
                <li>Eliminating dialog state management from parent</li>
                <li>Handling form state and validation</li>
                <li>Managing loading states</li>
                <li>Providing error handling</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/ui/primitives/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/components/ui/primitives/tabs';
import { EmployeeManager } from '@/features/employees/components/EmployeeManager';
import { SalesManager } from '@/features/sales/components/SalesManager';
import { Alert, AlertDescription, AlertTitle } from '@/core/components/ui/primitives/alert';
import { InfoIcon } from 'lucide-react';

/**
 * Component that showcases the refactored hooks architecture
 * 
 * This page demonstrates how our new hooks-based architecture makes it easy
 * to build consistent, maintainable components with minimal boilerplate.
 */
export function HooksShowcase() {
  return (
    <div className="container py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Hooks Architecture Showcase</h1>
        <p className="text-muted-foreground">
          This page demonstrates our new hooks-based architecture with standardized patterns 
          for dialogs, forms, and other common UI patterns.
        </p>
      </div>
      
      <Alert variant="default" className="bg-blue-50">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Architecture Improvement</AlertTitle>
        <AlertDescription>
          The components below leverage our new hooks architecture that eliminates duplication 
          while maintaining feature-specific functionality. Check out the 
          <code className="mx-1 px-1 py-0.5 bg-slate-100 rounded">docs/architecture/HOOKS_ARCHITECTURE.md</code>
          file for detailed implementation guidelines.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="employees" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="employees">Employee Management</TabsTrigger>
          <TabsTrigger value="sales">Sales Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <CardTitle>Employee Management</CardTitle>
              <CardDescription>
                Uses the <code>useEmployeeDialog</code> hook that extends <code>useEntityDialog</code> for employee-specific functionality.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmployeeManager 
                onEmployeeCreated={(employee) => console.log('Employee created:', employee)}
                onEmployeeUpdated={(employee) => console.log('Employee updated:', employee)}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales Management</CardTitle>
              <CardDescription>
                Uses the <code>useSalesDialog</code> hook that extends <code>useEntityDialog</code> for sales-specific functionality, 
                including specialized deletion flow.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SalesManager 
                onSaleCreated={(sale) => console.log('Sale created:', sale)}
                onSaleUpdated={(sale) => console.log('Sale updated:', sale)}
                onSaleDeleted={(id) => console.log('Sale deleted:', id)}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Implementation Benefits</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Reduced Duplication</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Common patterns are extracted to base hooks, eliminating boilerplate code and reducing the potential for bugs.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Consistent Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              <p>All features follow the same patterns for dialogs, forms, and data operations, making the codebase more maintainable.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Developer Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <p>The intuitive API makes it easy to implement new features while maintaining consistency with existing code.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default HooksShowcase;

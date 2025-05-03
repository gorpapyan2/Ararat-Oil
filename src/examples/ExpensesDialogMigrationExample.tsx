import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpensesManager } from "@/components/expenses/ExpensesManager";
import { ExpensesManagerStandardized } from "@/components/expenses/ExpensesManagerStandardized";

export function ExpensesDialogMigrationExample() {
  const [activeTab, setActiveTab] = useState("original");
  
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-8">Expenses Dialog Migration Example</h1>
      
      <div className="mb-8 p-4 bg-muted rounded-md">
        <h2 className="text-lg font-semibold mb-2">Migration Benefits</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Simplified Dialog Implementation:</strong> Reduced code complexity by using reusable components
          </li>
          <li>
            <strong>Improved Dialog State Management:</strong> Using customized hooks instead of local state
          </li>
          <li>
            <strong>Enhanced Accessibility:</strong> Focus management, keyboard navigation, and ARIA attributes
          </li>
          <li>
            <strong>Consistent UI/UX:</strong> Standardized dialog appearance and behavior
          </li>
          <li>
            <strong>Better Error Handling:</strong> Improved error handling with alert dialogs
          </li>
        </ul>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="original">Original Implementation</TabsTrigger>
          <TabsTrigger value="standardized">Standardized Implementation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="original" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Original ExpensesManager</CardTitle>
              <CardDescription>
                Uses the original dialog components without standardization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExpensesManager />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="standardized" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Standardized ExpensesManager</CardTitle>
              <CardDescription>
                Uses the new standardized dialog components and hooks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExpensesManagerStandardized />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Key Implementation Differences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Dialog Component Usage</h3>
              <ul className="list-disc pl-5 mt-2">
                <li><strong>Original:</strong> Multiple nested components (Dialog, DialogContent, DialogHeader, etc.)</li>
                <li><strong>Standardized:</strong> Single StandardDialog component with props</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium">State Management</h3>
              <ul className="list-disc pl-5 mt-2">
                <li><strong>Original:</strong> Manual useState and handlers</li>
                <li><strong>Standardized:</strong> useDialog hook with open, close, toggle methods</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Code Comparison</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Original Dialog Code</h3>
              <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
{`<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  <DialogContent className="sm:max-w-[600px]">
    <DialogHeader>
      <DialogTitle>
        {selectedExpense ? "Edit Expense" : "Add New Expense"}
      </DialogTitle>
    </DialogHeader>
    <ExpensesForm
      expense={selectedExpense}
      onCancel={() => setIsDialogOpen(false)}
      onSubmit={(formData) => {
        console.log("Form submitted:", formData);
        setIsDialogOpen(false);
      }}
      categories={categories}
      paymentMethods={paymentMethods}
    />
  </DialogContent>
</Dialog>`}
              </pre>
            </div>
            
            <div>
              <h3 className="font-medium">Standardized Dialog Code</h3>
              <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
{`<StandardDialog
  open={expenseDialog.isOpen}
  onOpenChange={expenseDialog.onOpenChange}
  title={selectedExpense ? "Edit Expense" : "Add New Expense"}
  description={selectedExpense 
    ? "Update the details of this expense record."
    : "Enter details to add a new expense record."}
  maxWidth="sm:max-w-[600px]"
>
  <ExpensesFormStandardized
    expense={selectedExpense}
    onCancel={expenseDialog.close}
    onSubmit={(formData) => {
      console.log("Form submitted:", formData);
      expenseDialog.close();
    }}
    categories={categories}
    paymentMethods={paymentMethods}
  />
</StandardDialog>`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
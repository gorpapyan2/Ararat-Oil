import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SalesDialogs } from "@/components/sales/SalesDialogs";
import { SalesDialogsStandardized } from "@/components/sales/SalesDialogsStandardized";
import { Sale } from "@/types";

// Sample sale data for demo purposes
const sampleSale: Sale = {
  id: "1",
  filling_system_id: "tank1",
  meter_start: 1000,
  meter_end: 1100,
  unit_price: 20.5,
  employee_id: "emp1",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  total_amount: 2050,
  liters_sold: 100,
  shift_id: "shift1",
};

export function SalesDialogMigrationExample() {
  // State for the original dialog
  const [isOriginalEditDialogOpen, setIsOriginalEditDialogOpen] = useState(false);
  const [isOriginalDeleteDialogOpen, setIsOriginalDeleteDialogOpen] = useState(false);
  
  // State for the standardized dialog
  const [isStandardizedEditDialogOpen, setIsStandardizedEditDialogOpen] = useState(false);
  const [isStandardizedDeleteDialogOpen, setIsStandardizedDeleteDialogOpen] = useState(false);
  
  // State for selected sale (shared between both examples)
  const [selectedSale, setSelectedSale] = useState<Sale | null>(sampleSale);
  
  // Demo handlers
  const handleUpdateSale = (data: any) => {
    console.log("Update sale:", data);
    if (isOriginalEditDialogOpen) setIsOriginalEditDialogOpen(false);
    if (isStandardizedEditDialogOpen) setIsStandardizedEditDialogOpen(false);
  };
  
  const handleCreateSale = (data: any) => {
    console.log("Create sale:", data);
    if (isOriginalEditDialogOpen) setIsOriginalEditDialogOpen(false);
    if (isStandardizedEditDialogOpen) setIsStandardizedEditDialogOpen(false);
  };
  
  const handleDeleteSale = () => {
    console.log("Delete sale:", selectedSale);
    if (isOriginalDeleteDialogOpen) setIsOriginalDeleteDialogOpen(false);
    if (isStandardizedDeleteDialogOpen) setIsStandardizedDeleteDialogOpen(false);
  };
  
  // Toggle between new and edit mode for demo
  const toggleNewMode = () => {
    if (selectedSale) {
      setSelectedSale(null);
    } else {
      setSelectedSale(sampleSale);
    }
  };
  
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-8">Sales Dialog Migration Example</h1>
      
      <div className="flex gap-8 mb-8">
        <Button onClick={toggleNewMode} variant="outline">
          {selectedSale ? "Switch to Create Mode" : "Switch to Edit Mode"}
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Original SalesDialogs */}
        <Card>
          <CardHeader>
            <CardTitle>Original Implementation</CardTitle>
            <CardDescription>
              Using the original dialog components
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => setIsOriginalEditDialogOpen(true)}
              className="mr-4"
            >
              {selectedSale ? "Edit Sale" : "Create Sale"}
            </Button>
            
            {selectedSale && (
              <Button 
                variant="destructive" 
                onClick={() => setIsOriginalDeleteDialogOpen(true)}
              >
                Delete Sale
              </Button>
            )}
            
            <SalesDialogs
              isEditDialogOpen={isOriginalEditDialogOpen}
              setIsEditDialogOpen={setIsOriginalEditDialogOpen}
              selectedSale={selectedSale}
              updateSale={handleUpdateSale}
              isDeleteDialogOpen={isOriginalDeleteDialogOpen}
              setIsDeleteDialogOpen={setIsOriginalDeleteDialogOpen}
              confirmDelete={handleDeleteSale}
              createSale={handleCreateSale}
            />
          </CardContent>
        </Card>
        
        {/* Standardized SalesDialogs */}
        <Card>
          <CardHeader>
            <CardTitle>Standardized Implementation</CardTitle>
            <CardDescription>
              Using the new standardized dialog components
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => setIsStandardizedEditDialogOpen(true)}
              className="mr-4"
            >
              {selectedSale ? "Edit Sale" : "Create Sale"}
            </Button>
            
            {selectedSale && (
              <Button 
                variant="destructive" 
                onClick={() => setIsStandardizedDeleteDialogOpen(true)}
              >
                Delete Sale
              </Button>
            )}
            
            <SalesDialogsStandardized
              isEditDialogOpen={isStandardizedEditDialogOpen}
              setIsEditDialogOpen={setIsStandardizedEditDialogOpen}
              selectedSale={selectedSale}
              updateSale={handleUpdateSale}
              isDeleteDialogOpen={isStandardizedDeleteDialogOpen}
              setIsDeleteDialogOpen={setIsStandardizedDeleteDialogOpen}
              confirmDelete={handleDeleteSale}
              createSale={handleCreateSale}
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 p-4 bg-muted rounded-md">
        <h2 className="text-lg font-semibold mb-2">Benefits of the Migration</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Simplified Implementation:</strong> Reduced from 95 lines to 57 lines (40% reduction)
          </li>
          <li>
            <strong>Better Accessibility:</strong> Focus management, keyboard navigation, and ARIA attributes handled consistently
          </li>
          <li>
            <strong>Enhanced UX:</strong> Consistent dialog behavior and styling across the application
          </li>
          <li>
            <strong>Improved Loading States:</strong> Built-in loading state handling in the delete dialog
          </li>
          <li>
            <strong>Better Maintenance:</strong> Centralized dialog logic for easier updates
          </li>
        </ul>
      </div>
    </div>
  );
} 
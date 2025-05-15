import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/ui/page-header";
import { Home, Fuel, Tag, AlertCircle, Plus, Pencil, Trash2, MoreHorizontal, History, ArrowUpDown } from "lucide-react";
import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";
import { 
  fuelPricesApi, 
  FuelPrice, 
  fuelTypesApi,
  FuelType as FuelTypeModel
} from "@/core/api";
import { FuelTypeCode } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/useToast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StandardDialog } from "@/components/ui/composed/dialog";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

// New type for the fuel type management
type FuelTypeDetails = FuelTypeModel;

// Specific fuel type codes array to avoid deep instantiation error
const FUEL_TYPE_CODES = ["diesel", "gas", "petrol_regular", "petrol_premium"] as const;

export default function FuelPricesPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fuelPrices, setFuelPrices] = useState<FuelPrice[]>([]);
  const [editPrices, setEditPrices] = useState<FuelPrice[]>([]);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [priceHistory, setPriceHistory] = useState<FuelPrice[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedFuelType, setSelectedFuelType] = useState<FuelTypeCode | undefined>(undefined);
  // State for fuel types management
  const [activeTab, setActiveTab] = useState("prices");
  const [fuelTypes, setFuelTypes] = useState<FuelTypeDetails[]>([]);
  const [isTypesLoading, setIsTypesLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newFuelType, setNewFuelType] = useState({ name: "" });
  const [editingFuelType, setEditingFuelType] = useState<FuelTypeDetails | null>(null);

  // Memoize breadcrumb segments to prevent unnecessary re-renders
  const breadcrumbSegments = useMemo(() => [
    { name: t("common.dashboard"), href: "/", icon: <Home className="h-4 w-4" /> },
    { name: t("common.fuelManagement"), href: "/fuel-management", icon: <Fuel className="h-4 w-4" /> },
    { 
      name: t("common.fuelPrices"), 
      href: "/fuel-management/fuel-prices", 
      isCurrent: true,
      icon: <Tag className="h-4 w-4" /> 
    }
  ], [t]);

  // Configure breadcrumb navigation with icons
  usePageBreadcrumbs({
    segments: breadcrumbSegments,
    title: t("common.fuelPrices")
  });

  // Load current fuel prices
  useEffect(() => {
    const loadFuelPrices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fuelPricesApi.getAll();
        setFuelPrices(response.data || []);
        setEditPrices(response.data || []);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load fuel prices:", err);
        setError(t("errors.loadFuelPricesFailed") || "Failed to load fuel prices. Please try again.");
        setIsLoading(false);
      }
    };

    loadFuelPrices();
  }, [t]);

  // Load fuel types
  useEffect(() => {
    const loadFuelTypes = async () => {
      try {
        setIsTypesLoading(true);
        setError(null);
        const response = await fuelTypesApi.getAll();
        setFuelTypes(response.data || []);
        setIsTypesLoading(false);
      } catch (err) {
        console.error("Failed to load fuel types:", err);
        setError(t("errors.loadFuelTypesFailed") || "Failed to load fuel types. Please try again.");
        setIsTypesLoading(false);
      }
    };

    if (activeTab === "types") {
      loadFuelTypes();
    }
  }, [activeTab, t]);

  // Load price history
  const loadPriceHistory = async (fuelType?: FuelTypeCode) => {
    setHistoryLoading(true);
    try {
      const params = fuelType ? { fuel_type: fuelType } : undefined;
      const response = await fuelPricesApi.getAll(params as any);
      setPriceHistory(response.data || []);
    } catch (err) {
      console.error("Failed to load price history:", err);
      toast({
        title: t("errors.loadPriceHistoryFailed") || "Failed to load price history",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        type: "error",
      });
    } finally {
      setHistoryLoading(false);
    }
  };

  // Refresh price history when selectedFuelType changes or when showing history
  useEffect(() => {
    if (showHistory) {
      loadPriceHistory(selectedFuelType);
    }
  }, [showHistory, selectedFuelType]);

  // Handle start editing
  const handleStartEditing = () => {
    setEditPrices(fuelPrices);
    setEditing(true);
  };

  // Handle cancel editing
  const handleCancelEditing = () => {
    setEditPrices(fuelPrices);
    setEditing(false);
  };

  // Handle price change
  const handlePriceChange = (fuelType: FuelTypeCode, value: string) => {
    const price = parseFloat(value);
    setEditPrices(prev => prev.map(p => 
      p.fuel_type === fuelType ? { ...p, price_per_liter: isNaN(price) ? 0 : price } : p
    ));
  };

  // Handle save prices - update to use create/update/delete logic per price
  const handleSavePrices = async () => {
    try {
      setSubmitting(true);
      setError(null);

      // Update prices
      await Promise.all(editPrices.map(async (price) => {
        if (price.id) {
          return fuelPricesApi.update(price.id, { price_per_liter: price.price_per_liter });
        } else {
          return fuelPricesApi.create({
            fuel_type: price.fuel_type as FuelTypeCode,
            price_per_liter: price.price_per_liter,
            effective_date: new Date().toISOString(),
          });
        }
      }));
      
      // Refresh prices
      const refreshedPrices = await fuelPricesApi.getAll();
      setFuelPrices(refreshedPrices.data || []);
      setEditing(false);
      setSubmitting(false);
      
      // Refresh history if showing
      if (showHistory) {
        loadPriceHistory(selectedFuelType);
      }
      
      toast({
        title: t("success.fuelPricesUpdated"),
        description: t("success.fuelPricesUpdatedDescription"),
      });
    } catch (err) {
      console.error("Failed to update fuel prices:", err);
      setError(err instanceof Error ? err.message : t("errors.updateFuelPricesFailed") || "Failed to update fuel prices. Please try again.");
      setSubmitting(false);
    }
  };

  // Handle add new fuel type
  const handleAddFuelType = async () => {
    if (!newFuelType.name) {
      toast({
        title: t("errors.invalidFuelType"),
        description: t("errors.fuelTypeRequiredFields"),
        type: "error"
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await fuelTypesApi.create({
        name: newFuelType.name,
        color: "#000000", // Default color
        price_per_liter: 0,
        status: 'active'
      });

      if (response.data) {
        setFuelTypes([...fuelTypes, response.data]);
        setIsAddDialogOpen(false);
        setNewFuelType({ name: "" });
        
        toast({
          title: t("success.fuelTypeAdded"),
          description: t("success.fuelTypeAddedDescription"),
          type: "success"
        });
      }
    } catch (err) {
      console.error("Failed to create fuel type:", err);
      toast({
        title: t("errors.invalidFuelType"),
        description: err instanceof Error ? err.message : t("errors.createFuelTypeFailed"),
        type: "error"
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit fuel type
  const handleEditFuelType = async () => {
    if (!editingFuelType || !editingFuelType.id) return;

    try {
      setSubmitting(true);
      const response = await fuelTypesApi.update(editingFuelType.id, {
        name: editingFuelType.name,
        status: editingFuelType.status as 'active' | 'inactive'
      });

      if (response.data) {
        setFuelTypes(fuelTypes.map(ft => 
          ft.id === editingFuelType.id ? response.data! : ft
        ));
        setIsEditDialogOpen(false);
        setEditingFuelType(null);
        
        toast({
          title: t("success.fuelTypeUpdated"),
          description: t("success.fuelTypeUpdatedDescription"),
          type: "success"
        });
      }
    } catch (err) {
      console.error("Failed to update fuel type:", err);
      toast({
        title: t("errors.updateFuelTypeFailed"),
        description: err instanceof Error ? err.message : t("errors.genericError"),
        type: "error"
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete fuel type
  const handleDeleteFuelType = async (id: string) => {
    try {
      await fuelTypesApi.delete(id);
      setFuelTypes(fuelTypes.filter(ft => ft.id !== id));
      
      toast({
        title: t("success.fuelTypeDeleted"),
        description: t("success.fuelTypeDeletedDescription"),
        type: "success"
      });
    } catch (err) {
      console.error("Failed to delete fuel type:", err);
      toast({
        title: t("errors.deleteFuelTypeFailed"),
        description: err instanceof Error ? err.message : t("errors.genericError"),
        type: "error"
      });
    }
  };

  // Format date function
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "PPP");
    } catch (e) {
      return dateStr;
    }
  };

  // Add new fuel type
  const renderAddFuelTypeDialog = () => (
    <StandardDialog
      open={isAddDialogOpen}
      onOpenChange={setIsAddDialogOpen}
      title={t("fuelPrices.addFuelType") || "Add Fuel Type"}
      description={t("fuelPrices.addFuelTypeDescription") || "Create a new fuel type for your station"}
      actions={
        <Button type="submit" onClick={handleAddFuelType}>
          {t("common.save") || "Save"}
        </Button>
      }
    >
      <div className="grid gap-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            {t("fuelPrices.name") || "Name"}
          </Label>
          <Input
            id="name"
            value={newFuelType.name}
            onChange={(e) => setNewFuelType({ name: e.target.value })}
            className="col-span-3"
          />
        </div>
      </div>
    </StandardDialog>
  );

  const renderEditFuelTypeDialog = () => (
    <StandardDialog
      open={isEditDialogOpen && editingFuelType !== null}
      onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) setEditingFuelType(null);
      }}
      title={t("fuelPrices.editFuelType") || "Edit Fuel Type"}
      actions={
        <Button type="submit" onClick={handleEditFuelType}>
          {t("common.save") || "Save"}
        </Button>
      }
    >
      {editingFuelType && (
        <div className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-name" className="text-right">
              {t("fuelPrices.name") || "Name"}
            </Label>
            <Input
              id="edit-name"
              value={editingFuelType?.name || ""}
              onChange={(e) => setEditingFuelType({ ...editingFuelType, name: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-status" className="text-right">
              {t("common.status") || "Status"}
            </Label>
            <Input
              id="edit-status"
              value={editingFuelType?.status || "active"}
              onChange={(e) => setEditingFuelType({ ...editingFuelType, status: e.target.value as 'active' | 'inactive' })}
              className="col-span-3"
            />
          </div>
        </div>
      )}
    </StandardDialog>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("common.fuelPrices") || "Fuel Prices"}
        description={t("fuelPrices.description") || "Manage your fuel types and prices"}
        icon={<Tag className="h-6 w-6 mr-2" />}
      />
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("common.error")}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="prices" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="prices">{t("fuelPrices.prices")}</TabsTrigger>
          <TabsTrigger value="history">{t("fuelPrices.priceHistory")}</TabsTrigger>
          <TabsTrigger value="types">{t("fuelPrices.fuelTypes")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="prices" className="mt-4">
          <div className="grid md:grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("fuelPrices.currentPrices") || "Current Fuel Prices"}</CardTitle>
                <CardDescription>
                  {t("fuelPrices.currentPricesDescription") || "View and update the current prices for each fuel type"}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("common.fuelType")}</TableHead>
                        <TableHead className="text-right">
                          {editing ? t("fuelPrices.newPrice") : t("common.pricePerLiter")} (֏)
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!isLoading && fuelPrices.map((price) => (
                        <TableRow key={price.id}>
                          <TableCell className="font-medium">
                            {t(`common.${price.fuel_type}`) || price.fuel_type}
                          </TableCell>
                          <TableCell className="text-right">
                            {editing ? (
                              <Input
                                type="number"
                                value={editPrices.find(p => p.id === price.id)?.price_per_liter.toString() || ''}
                                onChange={(e) => handlePriceChange(price.fuel_type as FuelTypeCode, e.target.value)}
                                min={0}
                                step={1}
                                className="w-24 ml-auto"
                              />
                            ) : (
                              <span>{price.price_per_liter.toLocaleString()}</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      {isLoading && Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={`loading-${index}`}>
                          <TableCell>
                            <div className="h-5 w-24 bg-muted animate-pulse rounded" />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="h-5 w-16 bg-muted animate-pulse rounded ml-auto" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end gap-2">
                {editing ? (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={handleCancelEditing}
                      disabled={submitting}
                    >
                      {t("common.cancel")}
                    </Button>
                    <Button 
                      onClick={handleSavePrices}
                      disabled={submitting}
                    >
                      {submitting ? t("common.saving") : t("common.save")}
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleStartEditing}>
                    {t("fuelPrices.updatePrices") || "Update Prices"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="mt-4" onFocus={() => setShowHistory(true)}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t("fuelPrices.priceHistory") || "Fuel Price History"}</CardTitle>
                <CardDescription>
                  {t("fuelPrices.priceHistoryDescription") || "View the history of fuel price changes"}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-[180px] justify-between">
                      {selectedFuelType ? t(`common.${selectedFuelType}`) || selectedFuelType : t("common.allFuelTypes")}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSelectedFuelType(undefined)}>
                      {t("common.allFuelTypes") || "All Fuel Types"}
                    </DropdownMenuItem>
                    {FUEL_TYPE_CODES.map(fuelType => (
                      <DropdownMenuItem 
                        key={fuelType}
                        onClick={() => setSelectedFuelType(fuelType as FuelTypeCode)}
                      >
                        {t(`common.${fuelType}`) || fuelType}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => loadPriceHistory(selectedFuelType)}
                  disabled={historyLoading}
                >
                  <History className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("common.fuelType")}</TableHead>
                      <TableHead>{t("common.pricePerLiter")} (֏)</TableHead>
                      <TableHead>{t("common.effectiveDate")}</TableHead>
                      <TableHead>{t("common.createdAt")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!historyLoading ? (
                      priceHistory.length > 0 ? (
                        priceHistory.map((price) => (
                          <TableRow key={price.id}>
                            <TableCell>
                              <Badge variant="outline">
                                {t(`common.${price.fuel_type}`) || price.fuel_type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {price.price_per_liter.toLocaleString()}
                            </TableCell>
                            <TableCell>{formatDate(price.effective_date)}</TableCell>
                            <TableCell>{formatDate(price.created_at || '')}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-6">
                            {t("fuelPrices.noHistory") || "No price history found"}
                          </TableCell>
                        </TableRow>
                      )
                    ) : (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={`loading-history-${index}`}>
                          <TableCell>
                            <div className="h-5 w-24 bg-muted animate-pulse rounded" />
                          </TableCell>
                          <TableCell>
                            <div className="h-5 w-16 bg-muted animate-pulse rounded" />
                          </TableCell>
                          <TableCell>
                            <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                          </TableCell>
                          <TableCell>
                            <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="types" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t("fuelPrices.fuelTypes") || "Fuel Types"}</CardTitle>
                <CardDescription>
                  {t("fuelPrices.fuelTypesDescription") || "Manage your fuel types"}
                </CardDescription>
              </div>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t("fuelPrices.addFuelType") || "Add Fuel Type"}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("fuelPrices.code") || "Code"}</TableHead>
                      <TableHead>{t("fuelPrices.name") || "Name"}</TableHead>
                      <TableHead>{t("common.status")}</TableHead>
                      <TableHead className="text-right">{t("common.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!isTypesLoading ? (
                      fuelTypes.length > 0 ? (
                        fuelTypes.map((fuelType) => (
                          <TableRow key={fuelType.id}>
                            <TableCell className="font-medium">{fuelType.id.substring(0, 8)}</TableCell>
                            <TableCell>{fuelType.name}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                fuelType.status === 'active' ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                              }`}>
                                {fuelType.status === 'active' ? t("common.active") : t("common.inactive")}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">{t("common.openMenu")}</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>{t("common.actions")}</DropdownMenuLabel>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setEditingFuelType(fuelType);
                                      setIsEditDialogOpen(true);
                                    }}
                                  >
                                    <Pencil className="h-4 w-4 mr-2" />
                                    {t("common.edit")}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => handleDeleteFuelType(fuelType.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    {t("common.delete")}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-6">
                            {t("fuelPrices.noFuelTypes") || "No fuel types found"}
                          </TableCell>
                        </TableRow>
                      )
                    ) : (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={`loading-type-${index}`}>
                          <TableCell>
                            <div className="h-5 w-16 bg-muted animate-pulse rounded" />
                          </TableCell>
                          <TableCell>
                            <div className="h-5 w-24 bg-muted animate-pulse rounded" />
                          </TableCell>
                          <TableCell>
                            <div className="h-5 w-16 bg-muted animate-pulse rounded" />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="h-5 w-8 bg-muted animate-pulse rounded ml-auto" />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {renderAddFuelTypeDialog()}
      {renderEditFuelTypeDialog()}
    </div>
  );
} 
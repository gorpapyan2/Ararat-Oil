import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/core/components/ui/page-header";
import {
  Home,
  Fuel,
  Tag,
  AlertCircle,
  Plus,
  Pencil,
  Trash2,
  MoreHorizontal,
  History,
  ArrowUpDown,
} from "lucide-react";
import { usePageBreadcrumbs } from "@/shared/hooks/usePageBreadcrumbs";
import { fuelTypesApi, FuelType as FuelTypeModel } from "@/core/api";
import {
  useFuelPrices,
  useUpdateFuelPrice,
  useCreateFuelPrice,
  getFuelPrices,
} from "@/features/fuel-prices";
import type { FuelPrice } from "@/features/fuel-prices";
import { FuelTypeCode } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/primitives/input";
import { Label } from "@/core/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/core/components/ui/alert";
import { useToast } from "@/hooks/useToast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/core/components/ui/tabs";
import { StandardDialog } from "@/core/components/ui/composed/dialog";
import { Badge } from "@/core/components/ui/primitives/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";
import { format } from "date-fns";
import {
  apiNamespaces,
  getApiErrorMessage,
  getApiSuccessMessage,
  getApiActionLabel,
} from "@/i18n/i18n";

// New type for the fuel type management
type FuelTypeDetails = FuelTypeModel;

// Specific fuel type codes array to avoid deep instantiation error
const FUEL_TYPE_CODES = [
  "diesel",
  "gas",
  "petrol_regular",
  "petrol_premium",
] as const;

export default function FuelPricesPage() {
  const { t } = useTranslation();
  const { toast } = useToast();

  // Use the new React Query hooks
  const {
    data: fuelPricesData,
    isLoading,
    error: fuelPricesError,
  } = useFuelPrices();
  const updateFuelPriceMutation = useUpdateFuelPrice();
  const createFuelPriceMutation = useCreateFuelPrice();

  const [error, setError] = useState<string | null>(null);
  const [fuelPrices, setFuelPrices] = useState<FuelPrice[]>([]);
  const [editPrices, setEditPrices] = useState<FuelPrice[]>([]);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [priceHistory, setPriceHistory] = useState<FuelPrice[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedFuelType, setSelectedFuelType] = useState<
    FuelTypeCode | undefined
  >(undefined);
  // State for fuel types management
  const [activeTab, setActiveTab] = useState("prices");
  const [fuelTypes, setFuelTypes] = useState<FuelTypeDetails[]>([]);
  const [isTypesLoading, setIsTypesLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newFuelType, setNewFuelType] = useState({ name: "" });
  const [editingFuelType, setEditingFuelType] =
    useState<FuelTypeDetails | null>(null);

  // Configure breadcrumb segments
  const breadcrumbSegments = [
    { name: t("common.home"), href: "/" },
    { name: t("common.fuelManagement"), href: "/fuel-management" },
    { name: t("common.fuelPrices"), href: "/fuel-management/prices", isCurrent: true },
  ];

  // Configure breadcrumb navigation with icons
  usePageBreadcrumbs({ segments: breadcrumbSegments });

  // Update local state when React Query data is loaded
  useEffect(() => {
    if (fuelPricesData) {
      setFuelPrices(fuelPricesData);
      if (!editing) setEditPrices(fuelPricesData);
    }
  }, [fuelPricesData, editing]);

  // Update error state when React Query error occurs
  useEffect(() => {
    if (fuelPricesError) {
      setError(
        fuelPricesError instanceof Error
          ? fuelPricesError.message
          : getApiErrorMessage(apiNamespaces.fuelPrices, "fetch")
      );
    } else {
      setError(null);
    }
  }, [fuelPricesError]);

  // Load fuel types
  useEffect(() => {
    const loadFuelTypes = async () => {
      try {
        setIsTypesLoading(true);
        setError(null);
        const response = await fuelTypesApi.getFuelTypes();
        setFuelTypes(response.data || []);
        setIsTypesLoading(false);
      } catch (err) {
        console.error("Failed to load fuel types:", err);
        setError(
          getApiErrorMessage(apiNamespaces.fuelPrices, "fetch", "fuel types")
        );
        setIsTypesLoading(false);
      }
    };

    if (activeTab === "types") {
      loadFuelTypes();
    }
  }, [activeTab, t]);

  // Load price history
  const loadPriceHistory = useCallback(async (fuelType?: FuelTypeCode) => {
    if (!fuelType) return;

    try {
      setHistoryLoading(true);
      const history = await getFuelPrices({ fuel_type: fuelType });
      setPriceHistory(history || []);
    } catch (err) {
      console.error("Failed to load price history:", err);
      setPriceHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  // Refresh price history when selectedFuelType changes or when showing history
  useEffect(() => {
    if (showHistory) {
      loadPriceHistory(selectedFuelType);
    }
  }, [showHistory, selectedFuelType, loadPriceHistory]);

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
    setEditPrices((prev) =>
      prev.map((p) =>
        p.fuel_type === fuelType
          ? { ...p, price_per_liter: isNaN(price) ? 0 : price }
          : p
      )
    );
  };

  // Handle save prices - update to use create/update/delete logic per price
  const handleSavePrices = async () => {
    try {
      setSubmitting(true);
      setError(null);

      // Update prices using mutations
      await Promise.all(
        editPrices.map(async (price) => {
          if (price.id) {
            return updateFuelPriceMutation.mutateAsync({
              id: price.id,
              data: { price_per_liter: price.price_per_liter },
            });
          } else {
            return createFuelPriceMutation.mutateAsync({
              fuel_type: price.fuel_type as FuelTypeCode,
              price_per_liter: price.price_per_liter,
              effective_date: new Date().toISOString(),
            });
          }
        })
      );

      setEditing(false);
      setSubmitting(false);

      // Refresh history if showing
      if (showHistory) {
        loadPriceHistory(selectedFuelType);
      }

      toast({
        title: t("common.success"),
        description: getApiSuccessMessage(
          apiNamespaces.fuelPrices,
          "update",
          "prices"
        ),
      });
    } catch (err) {
      console.error("Failed to update fuel prices:", err);
      setError(
        getApiErrorMessage(apiNamespaces.fuelPrices, "update", "prices")
      );
      setSubmitting(false);
    }
  };

  // Handle add new fuel type
  const handleAddFuelType = async () => {
    if (!newFuelType.name) {
      toast({
        title: t("common.error"),
        description: getApiErrorMessage(
          apiNamespaces.fuelPrices,
          "create",
          "fuel type"
        ),
        type: "error",
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await fuelTypesApi.createFuelType({
        name: newFuelType.name,
        color: "#000000", // Default color
        price_per_liter: 0,
        status: "active",
      });

      if (response.data) {
        setFuelTypes([...fuelTypes, response.data]);
        setIsAddDialogOpen(false);
        setNewFuelType({ name: "" });

        toast({
          title: t("common.success"),
          description: getApiSuccessMessage(
            apiNamespaces.fuelPrices,
            "create",
            "fuel type"
          ),
          type: "success",
        });
      }
    } catch (err) {
      console.error("Failed to create fuel type:", err);
      toast({
        title: t("common.error"),
        description: getApiErrorMessage(
          apiNamespaces.fuelPrices,
          "create",
          "fuel type"
        ),
        type: "error",
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
      const response = await fuelTypesApi.updateFuelType(editingFuelType.id, {
        name: editingFuelType.name,
        status: editingFuelType.status as "active" | "inactive",
      });

      if (response.data) {
        setFuelTypes(
          fuelTypes.map((ft) =>
            ft.id === editingFuelType.id ? response.data! : ft
          )
        );
        setIsEditDialogOpen(false);
        setEditingFuelType(null);

        toast({
          title: t("common.success"),
          description: getApiSuccessMessage(
            apiNamespaces.fuelPrices,
            "update",
            "fuel type"
          ),
          type: "success",
        });
      }
    } catch (err) {
      console.error("Failed to update fuel type:", err);
      toast({
        title: t("common.error"),
        description: getApiErrorMessage(
          apiNamespaces.fuelPrices,
          "update",
          "fuel type"
        ),
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete fuel type
  const handleDeleteFuelType = async (id: string) => {
    try {
      await fuelTypesApi.deleteFuelType(id);
      setFuelTypes(fuelTypes.filter((ft) => ft.id !== id));

      toast({
        title: t("common.success"),
        description: getApiSuccessMessage(
          apiNamespaces.fuelPrices,
          "delete",
          "fuel type"
        ),
        type: "success",
      });
    } catch (err) {
      console.error("Failed to delete fuel type:", err);
      toast({
        title: t("common.error"),
        description: getApiErrorMessage(
          apiNamespaces.fuelPrices,
          "delete",
          "fuel type"
        ),
        type: "error",
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
      isOpen={isAddDialogOpen}
      onOpenChange={setIsAddDialogOpen}
      title={
        t("fuelPrices.addFuelType") ||
        getApiActionLabel(apiNamespaces.fuelPrices, "create", "fuel type")
      }
      description={
        t("fuelPrices.addFuelTypeDescription") ||
        "Create a new fuel type for your station"
      }
      footer={
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
      isOpen={isEditDialogOpen && editingFuelType !== null}
      onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) setEditingFuelType(null);
      }}
      title={
        t("fuelPrices.editFuelType") ||
        getApiActionLabel(apiNamespaces.fuelPrices, "update", "fuel type")
      }
      footer={
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
              onChange={(e) =>
                setEditingFuelType({ ...editingFuelType, name: e.target.value })
              }
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
              onChange={(e) =>
                setEditingFuelType({
                  ...editingFuelType,
                  status: e.target.value as "active" | "inactive",
                })
              }
              className="col-span-3"
            />
          </div>
        </div>
      )}
    </StandardDialog>
  );

  // Get translated page title and description using the API translation helpers
  const pageTitle =
    t("common.fuelPrices") ||
    getApiActionLabel(apiNamespaces.fuelPrices, "list");
  const pageDescription =
    t("fuelPrices.description") || "Manage your fuel types and prices";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      <div className="container mx-auto p-6 space-y-6">
        <PageHeader
          title={pageTitle}
          description={pageDescription}
          className="text-white"
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700/50">
            <TabsTrigger value="prices" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              {t("fuelPrices.prices") || "Prices"}
            </TabsTrigger>
            <TabsTrigger value="types" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              {t("fuelPrices.fuelTypes") || "Fuel Types"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prices" className="space-y-6">
            {/* Error Alert */}
            {error && (
              <Alert className="bg-red-900/30 border-red-700/50 text-red-300">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t("common.error") || "Error"}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Current Prices Card */}
            <Card className="bg-gray-800/50 backdrop-blur border border-gray-700/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">
                    {t("fuelPrices.currentPrices") || "Current Fuel Prices"}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {t("fuelPrices.currentPricesDescription") ||
                      "View and update current fuel prices"}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {!editing && (
                    <Button 
                      onClick={handleStartEditing}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      {t("common.edit") || "Edit"}
                    </Button>
                  )}
                  {editing && (
                    <>
                      <Button
                        variant="outline"
                        onClick={handleCancelEditing}
                        disabled={submitting}
                        className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                      >
                        {t("common.cancel") || "Cancel"}
                      </Button>
                      <Button
                        onClick={handleSavePrices}
                        disabled={submitting}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {submitting
                          ? t("common.saving") || "Saving..."
                          : t("common.save") || "Save"}
                      </Button>
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-gray-400">
                    {t("common.loading") || "Loading..."}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(editing ? editPrices : fuelPrices).map((price) => (
                      <div
                        key={price.fuel_type}
                        className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600/50"
                      >
                        <div className="flex items-center gap-3">
                          <Fuel className="h-5 w-5 text-blue-400" />
                          <div>
                            <h3 className="font-medium text-white">{price.fuel_type}</h3>
                            <p className="text-sm text-gray-400">
                              {t("fuelPrices.lastUpdated") || "Last updated"}: {formatDate(price.updated_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {editing ? (
                            <div className="w-32">
                              <Input
                                type="number"
                                step="0.01"
                                value={
                                  editPrices.find((p) => p.fuel_type === price.fuel_type)
                                    ?.price_per_litre || ""
                                }
                                onChange={(e) =>
                                  handlePriceChange(price.fuel_type, e.target.value)
                                }
                                className="text-right bg-gray-800 border-gray-600 text-white"
                              />
                            </div>
                          ) : (
                            <div className="text-right">
                              <div className="text-xl font-bold text-white">
                                ${price.price_per_litre}
                              </div>
                              <div className="text-sm text-gray-400">per litre</div>
                            </div>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => loadPriceHistory(price.fuel_type)}
                            className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                          >
                            <History className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Price History Modal */}
            {showHistory && (
              <Card className="bg-gray-800/50 backdrop-blur border border-gray-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-white">
                    <span>
                      {t("fuelPrices.priceHistory") || "Price History"} - {selectedFuelType}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowHistory(false)}
                      className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                    >
                      ×
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {historyLoading ? (
                    <div className="text-center py-4 text-gray-400">
                      {t("common.loading") || "Loading..."}
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-gray-700/50">
                          <TableHead className="text-gray-300">{t("common.date") || "Date"}</TableHead>
                          <TableHead className="text-gray-300">{t("fuelPrices.price") || "Price"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {priceHistory.map((price, index) => (
                          <TableRow key={index} className="hover:bg-gray-700/50">
                            <TableCell className="text-white">{formatDate(price.updated_at)}</TableCell>
                            <TableCell className="text-white">${price.price_per_litre}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="types" className="space-y-6">
            <Card className="bg-gray-800/50 backdrop-blur border border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white">
                  {t("fuelPrices.manageFuelTypes") || "Manage Fuel Types"}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {t("fuelPrices.manageFuelTypesDescription") ||
                    "Add, edit, or remove fuel types"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end mb-4">
                  <Button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t("fuelPrices.addFuelType") || "Add Fuel Type"}
                  </Button>
                </div>

                {isTypesLoading ? (
                  <div className="text-center py-8 text-gray-400">
                    {t("common.loading") || "Loading..."}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-gray-700/50">
                        <TableHead className="text-gray-300">{t("common.name") || "Name"}</TableHead>
                        <TableHead className="text-gray-300">{t("common.actions") || "Actions"}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fuelTypes.map((type) => (
                        <TableRow key={type.id} className="hover:bg-gray-700/50">
                          <TableCell className="text-white">{type.name}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent 
                                align="end"
                                className="bg-gray-800 border-gray-700"
                              >
                                <DropdownMenuLabel className="text-gray-300">Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setEditingFuelType(type);
                                    setIsEditDialogOpen(true);
                                  }}
                                  className="text-gray-300 hover:bg-gray-700 hover:text-white"
                                >
                                  <Pencil className="h-4 w-4 mr-2" />
                                  {t("common.edit") || "Edit"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteFuelType(type.id)}
                                  className="text-red-400 hover:bg-red-500/20 hover:text-red-300"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  {t("common.delete") || "Delete"}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Fuel Type Dialog */}
        {renderAddFuelTypeDialog()}
        
        {/* Edit Fuel Type Dialog */}
        {renderEditFuelTypeDialog()}
      </div>
    </div>
  );
}

import React, { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/core/components/ui/page-header";
import { Home, Fuel, Building, Pencil, Trash2, Plus, Edit } from "lucide-react";
import { usePageBreadcrumbs } from "@/shared/hooks/usePageBreadcrumbs";
import { apiNamespaces, getApiActionLabel } from "@/i18n/i18n";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks";
import { Button } from "@/core/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/core/components/ui/table";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/core/components/ui/alert-dialog";

import { Card, CardHeader, CardTitle, CardContent } from "@/core/components/ui/card";

// For now, let's create a simple placeholder for the provider type
interface PetrolProvider {
  id: string;
  name: string;
  contact: string;
}

export default function ProvidersPage() {
  const { t } = useTranslation();
  const [action, setAction] = useState<React.ReactNode>(null);
  const [selectedProvider, setSelectedProvider] = useState<PetrolProvider | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Memoize breadcrumb segments to prevent unnecessary re-renders
  const breadcrumbSegments = useMemo(
    () => [
      {
        name: t("common.dashboard"),
        href: "/",
        icon: <Home className="h-4 w-4" />,
      },
      {
        name: t("common.fuelManagement"),
        href: "/fuel-management",
        icon: <Fuel className="h-4 w-4" />,
      },
      {
        name: t("providers.title") || t("common.providers"),
        href: "/fuel-management/providers",
        isCurrent: true,
        icon: <Building className="h-4 w-4" />,
      },
    ],
    [t]
  );

  // Configure breadcrumb navigation with icons
  usePageBreadcrumbs({
    segments: breadcrumbSegments,
    title: t("common.providers"),
  });

  // Get translated page title and description using the API translation helpers
  const pageTitle =
    t("providers.title") ||
    t("common.providers") ||
    getApiActionLabel(apiNamespaces.petrolProviders, "list");
  const pageDescription =
    t("providers.description") ||
    "Manage your fuel suppliers and their information";

  // Mock data for now - this will be replaced with real API calls
  const providers: PetrolProvider[] = [
    { id: "1", name: "Sample Provider 1", contact: "contact1@example.com" },
    { id: "2", name: "Sample Provider 2", contact: "contact2@example.com" },
  ];

  // Handler functions
  const handleOpenCreateDialog = useCallback(() => {
    setIsCreateDialogOpen(true);
  }, []);

  const handleOpenEditDialog = useCallback((provider: PetrolProvider) => {
    setSelectedProvider(provider);
    setIsEditDialogOpen(true);
  }, []);

  const handleOpenDeleteDialog = useCallback((provider: PetrolProvider) => {
    setSelectedProvider(provider);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleDeleteProvider = useCallback(() => {
    if (selectedProvider) {
      // This will be replaced with real delete mutation
      toast({
        title: t("common.success"),
        description: "Provider deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setSelectedProvider(null);
    }
  }, [selectedProvider, toast, t]);

  // Set the action button for create
  React.useEffect(() => {
    setAction(
      <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
        <Plus className="mr-2 h-4 w-4" />
        {t("common.addProvider")}
      </Button>
    );
  }, [setIsCreateDialogOpen, t]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      <div className="container mx-auto p-6 space-y-6">
        <PageHeader
          title={t("common.providers")}
          description={t("common.manageProviders")}
          actions={action}
          className="text-white"
        />

        <Card className="backdrop-blur-sm bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">{t("common.providers")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-white/20">
                  <TableHead className="text-gray-300">{t("common.name")}</TableHead>
                  <TableHead className="text-gray-300">{t("common.contactInfo")}</TableHead>
                  <TableHead className="text-gray-300">{t("common.fuelTypes")}</TableHead>
                  <TableHead className="text-gray-300">{t("common.status")}</TableHead>
                  <TableHead className="text-gray-300">{t("common.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {providers.map((provider) => (
                  <TableRow key={provider.id} className="border-white/20 hover:bg-white/5">
                    <TableCell className="text-white">{provider.name}</TableCell>
                    <TableCell className="text-gray-300">
                      {provider.contact}
                    </TableCell>
                    <TableCell className="text-gray-300">{provider.fuelTypes.join(", ")}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          provider.status === "active"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {provider.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditDialog(provider)}
                          className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDeleteDialog(provider)}
                          className="border-red-500/50 bg-red-500/10 hover:bg-red-500/20 text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent className="backdrop-blur-sm bg-gray-900/95 border-white/20">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">
                {t("common.confirmDelete")}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-300">
                {t("common.deleteProviderConfirmation")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-white/20 bg-white/10 hover:bg-white/20 text-white">
                {t("common.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteProvider}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {t("common.delete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

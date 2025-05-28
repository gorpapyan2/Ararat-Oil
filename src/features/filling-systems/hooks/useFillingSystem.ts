/**
 * useFillingSystem Hook
 *
 * Custom hook for working with filling systems data using React Query
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  apiNamespaces,
  getApiErrorMessage,
  getApiSuccessMessage,
} from "@/i18n/i18n";
import { useTranslation } from "react-i18next";

import {
  getFillingSystemsWithFilters,
  getFillingSystemById,
  createFillingSystem as createFillingSystemService,
  updateFillingSystem as updateFillingSystemService,
  deleteFillingSystem as deleteFillingSystemService,
  validateTankIds as validateTankIdsService,
} from "../services";
import type {
  FillingSystem,
  CreateFillingSystemRequest,
  UpdateFillingSystemRequest,
  FillingSystemFilters,
} from "../types";

/**
 * Hook for managing filling systems with React Query
 */
export const useFillingSystem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  /**
   * Query to fetch filling systems with optional filters
   */
  const useFillingSystemsQuery = (filters?: FillingSystemFilters) => {
    return useQuery({
      queryKey: ["filling-systems", filters],
      queryFn: () => getFillingSystemsWithFilters(filters),
    });
  };

  /**
   * Query to fetch a single filling system by ID
   */
  const useFillingSystemByIdQuery = (id: string) => {
    return useQuery({
      queryKey: ["filling-system", id],
      queryFn: () => getFillingSystemById(id),
      enabled: !!id,
    });
  };

  /**
   * Mutation to create a new filling system
   */
  const useCreateFillingSystemMutation = () => {
    return useMutation({
      mutationFn: (data: CreateFillingSystemRequest) =>
        createFillingSystemService(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["filling-systems"] });
        toast({
          title: t("common.success"),
          description: getApiSuccessMessage(
            apiNamespaces.fillingSystems,
            "create",
            "filling system"
          ),
        });
      },
      onError: (error) => {
        toast({
          title: t("common.error"),
          description: getApiErrorMessage(
            apiNamespaces.fillingSystems,
            "create",
            "filling system"
          ),
          variant: "destructive",
        });
      },
    });
  };

  /**
   * Mutation to update an existing filling system
   */
  const useUpdateFillingSystemMutation = () => {
    return useMutation({
      mutationFn: ({
        id,
        data,
      }: {
        id: string;
        data: UpdateFillingSystemRequest;
      }) => updateFillingSystemService(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["filling-systems"] });
        toast({
          title: t("common.success"),
          description: getApiSuccessMessage(
            apiNamespaces.fillingSystems,
            "update",
            "filling system"
          ),
        });
      },
      onError: (error) => {
        toast({
          title: t("common.error"),
          description: getApiErrorMessage(
            apiNamespaces.fillingSystems,
            "update",
            "filling system"
          ),
          variant: "destructive",
        });
      },
    });
  };

  /**
   * Mutation to delete a filling system
   */
  const useDeleteFillingSystemMutation = () => {
    return useMutation({
      mutationFn: (id: string) => deleteFillingSystemService(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["filling-systems"] });
        toast({
          title: t("common.success"),
          description: getApiSuccessMessage(
            apiNamespaces.fillingSystems,
            "delete",
            "filling system"
          ),
        });
      },
      onError: (error) => {
        toast({
          title: t("common.error"),
          description: getApiErrorMessage(
            apiNamespaces.fillingSystems,
            "delete",
            "filling system"
          ),
          variant: "destructive",
        });
      },
    });
  };

  /**
   * Validate tank IDs
   * This is a utility function used by the diagnostics tool
   */
  const validateTankIds = async (tankIds: string[]) => {
    try {
      return await validateTankIdsService(tankIds);
    } catch (error) {
      console.error("Failed to validate tank IDs:", error);
      return { valid: false, invalidIds: tankIds };
    }
  };

  return {
    useFillingSystemsQuery,
    useFillingSystemByIdQuery,
    useCreateFillingSystemMutation,
    useUpdateFillingSystemMutation,
    useDeleteFillingSystemMutation,
    validateTankIds,
  };
};

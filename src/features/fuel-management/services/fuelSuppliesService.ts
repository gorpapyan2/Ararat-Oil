import { useToast } from "@/core/hooks/useToast";
import { fuelSuppliesApi } from '@/core/api/endpoints/fuel-supplies';
import { useFuelSupplies } from '@/features/fuel-management/hooks/useFuelSupplies';
import { SupplyListItem } from '@/features/fuel-management/components/FuelSuppliesTable';
import { CreateSupplyData } from '@/features/fuel-management/components/CreateSupplyDialog';
import { useTranslation } from 'react-i18next';

export interface FuelSupplyCreateData {
  provider_id: string;
  tank_id: string;
  quantity_liters: number;
  price_per_liter: number;
  total_cost: number;
  delivery_date: string;
  payment_status: string;
  comments: string;
}

export const useFuelSuppliesService = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { refreshData } = useFuelSupplies();

  const loadSupplies = async () => {
    if (import.meta.env.DEV) {
      console.log('[FuelSuppliesService] loadSupplies called');
    }
    
    try {
      // Show loading state in the refresh button icon
      const refreshIcon = document.querySelector('.refresh-icon') as HTMLElement;
      if (refreshIcon) {
        refreshIcon.classList.add('animate-spin');
      }
      
      // Fetch fresh data
      await refreshData();
      
      // Show success notification
      toast({
        title: t('common.success'),
        description: t('fuelSupplies.refreshSuccess', 'Supplies refreshed successfully'),
        variant: "success"
      });
      
      return true;
    } catch (error) {
      console.error('Failed to load supplies:', error);
      
      // Show error notification
      toast({
        title: t('common.error'),
        description: t('fuelSupplies.refreshError', 'Failed to refresh supplies'),
        variant: "destructive"
      });
      
      return false;
    } finally {
      // Remove loading state from icon
      const refreshIcon = document.querySelector('.refresh-icon') as HTMLElement;
      if (refreshIcon) {
        refreshIcon.classList.remove('animate-spin');
      }
    }
  };

  const createSupply = async (data: CreateSupplyData): Promise<boolean> => {
    try {
      // Validate required fields
      if (!data.provider_id) {
        toast({
          title: t('common.error'),
          description: t('fuelSupplies.modal.validation.selectProvider'),
          variant: "destructive"
        });
        return false;
      }
      
      if (!data.tank_id) {
        toast({
          title: t('common.error'),
          description: t('fuelSupplies.modal.validation.selectTank'),
          variant: "destructive"
        });
        return false;
      }
      
      if (!data.quantity_liters || data.quantity_liters <= 0) {
        toast({
          title: t('common.error'),
          description: t('fuelSupplies.modal.validation.enterValidQuantity'),
          variant: "destructive"
        });
        return false;
      }
      
      if (!data.price_per_liter || data.price_per_liter <= 0) {
        toast({
          title: t('common.error'),
          description: t('fuelSupplies.modal.validation.enterValidPrice'),
          variant: "destructive"
        });
        return false;
      }
      
      if (!data.delivery_date) {
        toast({
          title: t('common.error'),
          description: t('fuelSupplies.modal.validation.enterValidDate'),
          variant: "destructive"
        });
        return false;
      }
      
      // Calculate total_cost and format payload
      const totalCost = data.quantity_liters * data.price_per_liter;
      
      // Ensure delivery_date is in ISO format
      let formattedDeliveryDate = data.delivery_date;
      try {
        if (!formattedDeliveryDate.includes('T')) {
          formattedDeliveryDate = new Date(formattedDeliveryDate).toISOString();
        } else if (!formattedDeliveryDate.includes('Z')) {
          formattedDeliveryDate = new Date(formattedDeliveryDate).toISOString();
        }
      } catch (e) {
        console.error('Error formatting delivery date:', e);
        formattedDeliveryDate = new Date().toISOString();
      }
      
      const supplyData: FuelSupplyCreateData = {
        provider_id: data.provider_id,
        tank_id: data.tank_id,
        quantity_liters: Number(data.quantity_liters),
        price_per_liter: Number(data.price_per_liter),
        total_cost: Number(totalCost.toFixed(2)),
        delivery_date: formattedDeliveryDate,
        payment_status: data.payment_status || 'pending',
        comments: data.comments || ''
      };
      
      console.log('Creating supply with data:', JSON.stringify(supplyData, null, 2));
      
      const response = await fuelSuppliesApi.createFuelSupply(supplyData);
      
      if (response.data) {
        toast({
          title: t('common.success'),
          description: t('fuelSupplies.modal.createSuccess'),
          variant: "success"
        });
        
        await refreshData();
        return true;
      } else {
        toast({
          title: t('common.error'),
          description: response.error?.message || t('common.unknownError'),
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error creating supply:', error);
      toast({
        title: t('common.error'),
        description: t('fuelSupplies.modal.createError'),
        variant: "destructive"
      });
      return false;
    }
  };

  const updateSupply = async (supplyId: string, data: CreateSupplyData): Promise<boolean> => {
    try {
      // Validate required fields (similar to create)
      if (!data.provider_id) {
        toast({
          title: t('common.error'),
          description: t('fuelSupplies.modal.validation.selectProvider'),
          variant: "destructive"
        });
        return false;
      }
      
      if (!data.tank_id) {
        toast({
          title: t('common.error'),
          description: t('fuelSupplies.modal.validation.selectTank'),
          variant: "destructive"
        });
        return false;
      }
      
      if (!data.quantity_liters || data.quantity_liters <= 0) {
        toast({
          title: t('common.error'),
          description: t('fuelSupplies.modal.validation.enterValidQuantity'),
          variant: "destructive"
        });
        return false;
      }
      
      if (!data.price_per_liter || data.price_per_liter <= 0) {
        toast({
          title: t('common.error'),
          description: t('fuelSupplies.modal.validation.enterValidPrice'),
          variant: "destructive"
        });
        return false;
      }
      
      if (!data.delivery_date) {
        toast({
          title: t('common.error'),
          description: t('fuelSupplies.modal.validation.enterValidDate'),
          variant: "destructive"
        });
        return false;
      }
      
      // Calculate total_cost and prepare update data
      const totalCost = data.quantity_liters * data.price_per_liter;
      
      // Ensure delivery_date is in ISO format
      let formattedDeliveryDate = data.delivery_date;
      try {
        if (!formattedDeliveryDate.includes('T')) {
          formattedDeliveryDate = new Date(formattedDeliveryDate).toISOString();
        } else if (!formattedDeliveryDate.includes('Z')) {
          formattedDeliveryDate = new Date(formattedDeliveryDate).toISOString();
        }
      } catch (e) {
        console.error('Error formatting delivery date:', e);
        formattedDeliveryDate = new Date().toISOString();
      }
      
      const supplyData: FuelSupplyCreateData = {
        provider_id: data.provider_id,
        tank_id: data.tank_id,
        quantity_liters: Number(data.quantity_liters),
        price_per_liter: Number(data.price_per_liter),
        total_cost: Number(totalCost.toFixed(2)),
        delivery_date: formattedDeliveryDate,
        payment_status: data.payment_status || 'pending',
        comments: data.comments || ''
      };
      
      console.log('Updating supply with data:', JSON.stringify(supplyData, null, 2));
      
      const response = await fuelSuppliesApi.updateFuelSupply(supplyId, supplyData);
      
      if (response.data) {
        toast({
          title: t('common.success'),
          description: t('fuelSupplies.modal.updateSuccess', 'Supply updated successfully'),
          variant: "success"
        });
        
        await refreshData();
        return true;
      } else {
        toast({
          title: t('common.error'),
          description: response.error?.message || t('common.unknownError'),
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error updating supply:', error);
      toast({
        title: t('common.error'),
        description: t('fuelSupplies.modal.updateError', 'Error updating supply'),
        variant: "destructive"
      });
      return false;
    }
  };
  
  const deleteSupply = async (supplyId: string): Promise<boolean> => {
    try {
      const response = await fuelSuppliesApi.deleteFuelSupply(supplyId);
      
      if (response.data?.success) {
        toast({
          title: t('common.success'),
          description: t('fuelSupplies.modal.deleteSuccess', 'Supply deleted successfully'),
          variant: "success",
          duration: 3000 // Ensure it stays visible for 3 seconds
        });
        
        // Wait a moment to ensure toast is visible
        await new Promise(resolve => setTimeout(resolve, 100));
        
        await refreshData();
        return true;
      } else {
        toast({
          title: t('common.error'),
          description: response.error?.message || t('common.unknownError'),
          variant: "destructive",
          duration: 5000
        });
        return false;
      }
    } catch (error) {
      console.error('Error deleting supply:', error);
      toast({
        title: t('common.error'),
        description: t('fuelSupplies.modal.deleteError', 'Error deleting supply'),
        variant: "destructive",
        duration: 5000
      });
      return false;
    }
  };

  return {
    loadSupplies,
    createSupply,
    updateSupply,
    deleteSupply
  };
}; 
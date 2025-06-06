import React from 'react';
import { Control, UseFormReturn } from 'react-hook-form';
import { FormInput } from '@/core/components/ui/primitives/form-fields';
import { useTranslation } from 'react-i18next';
import { SalesFormData } from '@/features/sales/types';

interface PriceAndEmployeeInputsProps {
  form: UseFormReturn<SalesFormData>;
  control: Control<SalesFormData>;
}

export function PriceAndEmployeeInputs({ form, control }: PriceAndEmployeeInputsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormInput
        name="unitPrice"
        label={t('sales.unitPrice')}
        type="number"
        form={form}
        placeholder={t('sales.enterUnitPrice')}
      />
      
      <FormInput
        name="amount"
        label={t('sales.totalAmount')}
        type="number"
        form={form}
        placeholder={t('sales.enterTotalAmount')}
      />
      
      <FormInput
        name="quantityLiters"
        label={t('sales.quantity')}
        type="number"
        form={form}
        placeholder={t('sales.enterQuantity')}
      />
      
      <FormInput
        name="customerName"
        label={t('sales.customerName')}
        type="text"
        form={form}
        placeholder={t('sales.enterCustomerName')}
      />
    </div>
  );
} 
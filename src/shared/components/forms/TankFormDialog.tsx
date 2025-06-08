import React, { useMemo } from 'react';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent } from '@/core/components/ui/dialog';
import { Button } from '@/core/components/ui/button';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/components/ui/select';
import { Textarea } from '@/core/components/ui/textarea';
import { useZodForm, useFormSubmitHandler } from '@/shared/hooks';
import { useTankMutations, useFuelTypes } from '@/shared/hooks/useTanks';
import type { Tank, TankCreate, TankUpdate } from '@/shared/types/tank.types';
import { useToast } from '@/hooks';
import { NavigationIcons, ActionIcons, StatusIcons } from '@/shared/components/ui/icons';
import { Save } from 'lucide-react';

interface TankFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  tank?: Tank | null;
  mode?: 'create' | 'edit';
}

const tankSchema = z.object({
  name: z
    .string({ required_error: 'Tank name is required' })
    .min(2, 'Tank name must be at least 2 characters'),
  fuel_type_id: z
    .string({ required_error: 'Fuel type is required' })
    .min(1, 'Please select a fuel type'),
  capacity: z
    .number({ required_error: 'Capacity is required' })
    .min(1, 'Capacity must be greater than 0'),
  current_level: z
    .number({ required_error: 'Current level is required' })
    .min(0, 'Current level cannot be negative'),
  notes: z.string().optional(),
});

type TankFormData = z.infer<typeof tankSchema>;

export function TankFormDialog({
  open,
  onOpenChange,
  onSuccess,
  tank,
  mode = tank ? 'edit' : 'create'
}: TankFormDialogProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { data: fuelTypes = [] } = useFuelTypes();
  const { createTank, updateTank } = useTankMutations();

  const form = useZodForm({
    schema: tankSchema,
    defaultValues: {
      name: tank?.name || '',
      fuel_type_id: tank?.fuel_type_id || '',
      capacity: tank?.capacity || 0,
      current_level: tank?.current_level || 0,
      notes: tank?.notes || '',
    },
  });

  const watchedCapacity = form.watch('capacity');
  const watchedCurrentLevel = form.watch('current_level');
  
  const fillPercentage = useMemo(() => {
    if (watchedCapacity > 0 && watchedCurrentLevel >= 0) {
      return Math.round((watchedCurrentLevel / watchedCapacity) * 100);
    }
    return 0;
  }, [watchedCapacity, watchedCurrentLevel]);

  const isOverCapacity = watchedCurrentLevel > watchedCapacity && watchedCapacity > 0;

  const { isSubmitting, handleSubmit } = useFormSubmitHandler<TankFormData>(
    form,
    async (data) => {
      try {
        // Validate current level doesn't exceed capacity
        if (data.current_level > data.capacity) {
          toast({
            title: t('common.error'),
            description: t('modules.tanks.modals.create.validation.exceedsCapacity'),
            variant: 'destructive',
          });
          return;
        }

        if (mode === 'edit' && tank) {
          const updateData: TankUpdate = {
            name: data.name,
            fuel_type_id: data.fuel_type_id,
            capacity: data.capacity,
            current_level: data.current_level,
            notes: data.notes,
          };
          await updateTank.mutateAsync({ id: tank.id, data: updateData });
          toast({
            title: t('common.success'),
            description: t('modules.tanks.actions.updated'),
          });
        } else {
          const createData: TankCreate = {
            name: data.name,
            fuel_type_id: data.fuel_type_id,
            capacity: data.capacity,
            current_level: data.current_level,
            is_active: true,
            notes: data.notes,
          };
          await createTank.mutateAsync(createData);
          toast({
            title: t('common.success'),
            description: t('modules.tanks.actions.created'),
          });
        }

        form.reset();
        onOpenChange(false);
        onSuccess?.();
      } catch (error) {
        console.error('Tank form error:', error);
        toast({
          title: t('common.error'),
          description: mode === 'edit' 
            ? t('modules.tanks.actions.updateError')
            : t('modules.tanks.actions.createError'),
          variant: 'destructive',
        });
      }
    }
  );

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0 bg-core-white dark:bg-card border border-core-tertiary dark:border-border shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 border-b border-core-light dark:border-border pb-4">
            <h3 className="text-xl font-semibold text-core-primary dark:text-card-foreground">
              {mode === 'edit' 
                ? t('modules.tanks.modals.edit.title') 
                : t('modules.tanks.modals.create.title')
              }
            </h3>
            <button 
              onClick={handleClose}
              className="p-2 text-core-secondary dark:text-muted-foreground hover:text-core-primary dark:hover:text-card-foreground rounded-lg hover:bg-core-light dark:hover:bg-muted transition-all duration-200"
            >
              <NavigationIcons.Close className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tank Name */}
              <div>
                <label className="block text-sm font-medium text-core-primary dark:text-card-foreground mb-2">
                  {t('modules.tanks.modals.create.fields.name')} *
                </label>
                <input
                  type="text"
                  {...form.register('name')}
                  placeholder={t('modules.tanks.modals.create.placeholders.name')}
                  className="w-full px-4 py-3 bg-core-white dark:bg-background border border-core-tertiary dark:border-border rounded-lg text-core-primary dark:text-card-foreground placeholder:text-core-secondary dark:placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-natural-accent dark:focus:ring-accent focus:border-natural-accent dark:focus:border-accent transition-all duration-200"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-status-critical mt-2 font-medium">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              {/* Fuel Type */}
              <div>
                <label className="block text-sm font-medium text-core-primary dark:text-card-foreground mb-2">
                  {t('modules.tanks.modals.create.fields.fuelType')} *
                </label>
                <select
                  {...form.register('fuel_type_id')}
                  className="w-full px-4 py-3 bg-core-white dark:bg-background border border-core-tertiary dark:border-border rounded-lg text-core-primary dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-natural-accent dark:focus:ring-accent focus:border-natural-accent dark:focus:border-accent transition-all duration-200 appearance-none cursor-pointer"
                >
                  <option value="" className="text-core-secondary dark:text-muted-foreground">
                    {t('modules.tanks.modals.create.placeholders.selectFuelType')}
                  </option>
                  {fuelTypes.map((fuelType) => (
                    <option 
                      key={fuelType.id} 
                      value={String(fuelType.id)}
                      className="text-core-primary dark:text-card-foreground"
                    >
                      {fuelType.name}
                    </option>
                  ))}
                </select>
                {form.formState.errors.fuel_type_id && (
                  <p className="text-sm text-status-critical mt-2 font-medium">
                    {form.formState.errors.fuel_type_id.message}
                  </p>
                )}
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-sm font-medium text-core-primary dark:text-card-foreground mb-2">
                  {t('modules.tanks.modals.create.fields.capacity')} *
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  {...form.register('capacity', { valueAsNumber: true })}
                  placeholder={t('modules.tanks.modals.create.placeholders.capacity')}
                  className="w-full px-4 py-3 bg-core-white dark:bg-background border border-core-tertiary dark:border-border rounded-lg text-core-primary dark:text-card-foreground placeholder:text-core-secondary dark:placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-natural-accent dark:focus:ring-accent focus:border-natural-accent dark:focus:border-accent transition-all duration-200"
                />
                {form.formState.errors.capacity && (
                  <p className="text-sm text-status-critical mt-2 font-medium">
                    {form.formState.errors.capacity.message}
                  </p>
                )}
              </div>

              {/* Current Level */}
              <div>
                <label className="block text-sm font-medium text-core-primary dark:text-card-foreground mb-2">
                  {t('modules.tanks.modals.create.fields.currentLevel')} *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  {...form.register('current_level', { valueAsNumber: true })}
                  placeholder={t('modules.tanks.modals.create.placeholders.currentLevel')}
                  className="w-full px-4 py-3 bg-core-white dark:bg-background border border-core-tertiary dark:border-border rounded-lg text-core-primary dark:text-card-foreground placeholder:text-core-secondary dark:placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-natural-accent dark:focus:ring-accent focus:border-natural-accent dark:focus:border-accent transition-all duration-200"
                />
                
                {/* Capacity Progress Indicator */}
                {watchedCapacity > 0 && watchedCurrentLevel >= 0 && (
                  <div className="mt-3 p-3 bg-core-light dark:bg-muted rounded-lg border border-core-tertiary/30 dark:border-border">
                    <div className="flex items-center justify-between text-xs text-core-secondary dark:text-muted-foreground mb-2">
                      <span className="font-medium">Fill Level</span>
                      <span className={`font-bold ${
                        isOverCapacity ? 'text-status-critical' : 
                        fillPercentage < 10 ? 'text-status-critical' :
                        fillPercentage < 25 ? 'text-status-warning' :
                        'text-status-operational'
                      }`}>
                        {fillPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-core-tertiary/20 dark:bg-secondary rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isOverCapacity ? 'bg-status-critical' :
                          fillPercentage < 10 ? 'bg-status-critical' :
                          fillPercentage < 25 ? 'bg-status-warning' :
                          fillPercentage < 50 ? 'bg-fuel-electric' :
                          'bg-status-operational'
                        }`}
                        style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {form.formState.errors.current_level && (
                  <p className="text-sm text-status-critical mt-2 font-medium">
                    {form.formState.errors.current_level.message}
                  </p>
                )}
                {isOverCapacity && (
                  <p className="text-sm text-status-critical mt-2 font-medium flex items-center gap-2">
                    <span>⚠️</span>
                    {t('modules.tanks.modals.create.validation.exceedsCapacity')}
                  </p>
                )}
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-core-primary dark:text-card-foreground mb-2">
                  {t('common.notes')}
                </label>
                <textarea
                  rows={3}
                  {...form.register('notes')}
                  placeholder={t('modules.tanks.modals.create.fields.notes')}
                  className="w-full px-4 py-3 bg-core-white dark:bg-background border border-core-tertiary dark:border-border rounded-lg text-core-primary dark:text-card-foreground placeholder:text-core-secondary dark:placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-natural-accent dark:focus:ring-accent focus:border-natural-accent dark:focus:border-accent resize-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8 pt-6 border-t border-core-light dark:border-border">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 text-sm font-medium text-core-secondary dark:text-muted-foreground border border-core-tertiary dark:border-border rounded-lg hover:bg-core-light dark:hover:bg-muted hover:text-core-primary dark:hover:text-card-foreground transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('modules.tanks.actions.cancel')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isOverCapacity}
                className="flex-1 px-6 py-3 text-sm font-medium bg-natural-accent dark:bg-accent text-core-primary dark:text-accent-foreground rounded-lg hover:bg-natural-accent/90 dark:hover:bg-accent/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <StatusIcons.Loading className="w-4 h-4 animate-spin" />
                    {t('modules.tanks.actions.creating')}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {mode === 'edit' 
                      ? t('common.save')
                      : t('modules.tanks.actions.createTank')
                    }
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
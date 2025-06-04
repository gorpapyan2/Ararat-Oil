import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller, FieldError, UseFormProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Eye,
  EyeOff,
  Calendar,
  Upload,
  X,
  Plus,
  AlertCircle,
  CheckCircle,
  Info,
  Loader2,
  Copy,
  ExternalLink
} from 'lucide-react';

import { cn } from '@/shared/utils';
import { Button } from '@/core/components/ui/button';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
import { Textarea } from '@/core/components/ui/textarea';
import { Checkbox } from '@/core/components/ui/checkbox';
import { Switch } from '@/core/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/core/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Badge } from '@/core/components/ui/primitives/badge';
import { Progress } from '@/core/components/ui/progress';

export type FieldType = 
  | 'text' 
  | 'email' 
  | 'password' 
  | 'number' 
  | 'textarea' 
  | 'select' 
  | 'radio' 
  | 'checkbox' 
  | 'switch' 
  | 'date' 
  | 'file' 
  | 'multi-select'
  | 'custom';

export interface FieldOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  description?: string;
}

export interface FormField<T = unknown> {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  validation?: z.ZodSchema<T>;
  options?: FieldOption[];
  defaultValue?: T;
  conditional?: {
    field: string;
    value: unknown;
    operator?: 'equals' | 'not-equals' | 'contains' | 'greater-than' | 'less-than';
  };
  grid?: {
    col?: number;
    row?: number;
    span?: number;
  };
  customComponent?: React.ComponentType<FieldComponentProps<T>>;
  props?: Record<string, unknown>;
}

export interface FormSection<T = Record<string, unknown>> {
  id: string;
  title: string;
  description?: string;
  fields: FormField<T[keyof T]>[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export interface FormBuilderProps<T = Record<string, unknown>> {
  sections: FormSection<T>[];
  onSubmit: (data: T) => Promise<void> | void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  validationSchema?: z.ZodSchema<T>;
  defaultValues?: Partial<T>;
  autoSave?: boolean;
  autoSaveInterval?: number;
  showProgress?: boolean;
  resetOnSubmit?: boolean;
}

interface FieldComponentProps<T = unknown> {
  field: FormField<T>;
  value: T;
  onChange: (value: T) => void;
  onBlur: () => void;
  error?: FieldError;
  disabled?: boolean;
}

function FieldComponent({
  field,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
}: FieldComponentProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const baseInputProps = {
    value: value || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value as any),
    onBlur: () => {
      setFocused(false);
      onBlur();
    },
    onFocus: () => setFocused(true),
    disabled,
    placeholder: field.placeholder,
    className: cn(
      'transition-all duration-200',
      error && 'border-red-500 focus:border-red-500',
      focused && !error && 'border-blue-500 ring-1 ring-blue-500/20'
    ),
  };

  switch (field.type) {
    case 'text':
    case 'email':
    case 'number':
      return (
        <Input
          {...baseInputProps}
          type={field.type}
          step={field.type === 'number' ? field.props?.step : undefined}
          min={field.type === 'number' ? field.props?.min : undefined}
          max={field.type === 'number' ? field.props?.max : undefined}
        />
      );

    case 'password':
      return (
        <div className="relative">
          <Input
            {...baseInputProps}
            type={showPassword ? 'text' : 'password'}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-500" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500" />
            )}
          </Button>
        </div>
      );

    case 'textarea':
      return (
        <Textarea
          {...baseInputProps}
          rows={field.props?.rows || 4}
          resize={field.props?.resize || 'both'}
        />
      );

    case 'select':
      return (
        <Select
          value={value}
          onValueChange={onChange}
          disabled={disabled}
        >
          <SelectTrigger className={cn(error && 'border-red-500')}>
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => (
              <SelectItem
                key={option.value}
                value={String(option.value)}
                disabled={option.disabled}
              >
                <div className="flex flex-col">
                  <span>{option.label}</span>
                  {option.description && (
                    <span className="text-sm text-gray-500">{option.description}</span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case 'radio':
      return (
        <RadioGroup
          value={value}
          onValueChange={onChange}
          disabled={disabled}
          className="space-y-2"
        >
          {field.options?.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={String(option.value)}
                id={`${field.id}-${option.value}`}
                disabled={option.disabled}
              />
              <Label
                htmlFor={`${field.id}-${option.value}`}
                className={cn(
                  'cursor-pointer',
                  option.disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                <div className="flex flex-col">
                  <span>{option.label}</span>
                  {option.description && (
                    <span className="text-sm text-gray-500">{option.description}</span>
                  )}
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      );

    case 'checkbox':
      return (
        <div className="space-y-2">
          {field.options?.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`${field.id}-${option.value}`}
                checked={Array.isArray(value) ? value.includes(option.value) : false}
                onCheckedChange={(checked) => {
                  const currentValues = Array.isArray(value) ? value : [];
                  if (checked) {
                    onChange([...currentValues, option.value]);
                  } else {
                    onChange(currentValues.filter((v: any) => v !== option.value));
                  }
                }}
                disabled={disabled || option.disabled}
              />
              <Label
                htmlFor={`${field.id}-${option.value}`}
                className={cn(
                  'cursor-pointer',
                  (disabled || option.disabled) && 'opacity-50 cursor-not-allowed'
                )}
              >
                <div className="flex flex-col">
                  <span>{option.label}</span>
                  {option.description && (
                    <span className="text-sm text-gray-500">{option.description}</span>
                  )}
                </div>
              </Label>
            </div>
          )) || (
            <div className="flex items-center space-x-2">
              <Checkbox
                id={field.id}
                checked={!!value}
                onCheckedChange={onChange}
                disabled={disabled}
              />
              <Label htmlFor={field.id} className="cursor-pointer">
                {field.label}
              </Label>
            </div>
          )}
        </div>
      );

    case 'switch':
      return (
        <div className="flex items-center space-x-2">
          <Switch
            checked={!!value}
            onCheckedChange={onChange}
            disabled={disabled}
          />
          <Label htmlFor={field.id} className="cursor-pointer">
            {field.label}
          </Label>
        </div>
      );

    case 'date':
      return (
        <div className="relative">
          <Input
            {...baseInputProps}
            type="date"
          />
          <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      );

    case 'file':
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-center w-full">
            <Label
              htmlFor={field.id}
              className={cn(
                'flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800',
                error ? 'border-red-300' : 'border-gray-300',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  {field.props?.accept || 'Any file type'}
                </p>
              </div>
              <Input
                id={field.id}
                type="file"
                className="hidden"
                onChange={(e) => onChange(e.target.files?.[0] as any)}
                accept={field.props?.accept}
                multiple={field.props?.multiple}
                disabled={disabled}
              />
            </Label>
          </div>
          {value && (
            <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <span className="text-sm truncate">{value.name || value}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange(null as any)}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      );

    case 'custom':
      if (field.customComponent) {
        const CustomComponent = field.customComponent;
        return (
          <CustomComponent
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            error={error}
            disabled={disabled}
            field={field}
            {...field.props}
          />
        );
      }
      return null;

    default:
      return <Input {...baseInputProps} />;
  }
}

function FormFieldWrapper({ field, children, error }: { 
  field: FormField<unknown>; 
  children: React.ReactNode; 
  error?: FieldError; 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'space-y-2',
        field.grid?.span && `col-span-${field.grid.span}`
      )}
    >
      {field.type !== 'checkbox' && field.type !== 'switch' && (
        <Label htmlFor={field.id} className="text-sm font-medium">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      {children}
      
      {field.description && (
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <Info className="h-3 w-3" />
          {field.description}
        </p>
      )}
      
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-sm text-red-600 flex items-center gap-1"
          >
            <AlertCircle className="h-3 w-3" />
            {error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FormBuilder<T = Record<string, unknown>>({
  sections,
  onSubmit,
  onCancel,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  loading = false,
  disabled = false,
  className,
  validationSchema,
  defaultValues = {},
  autoSave = false,
  autoSaveInterval = 5000,
  showProgress = false,
  resetOnSubmit = false,
}: FormBuilderProps<T>) {
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set(sections.filter(s => s.defaultCollapsed).map(s => s.id))
  );

  const allFields = useMemo(() => 
    sections.flatMap(section => section.fields),
    [sections]
  );

  const form = useForm({
    resolver: validationSchema ? zodResolver(validationSchema) : undefined,
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, control, watch, formState: { errors, isValid, isDirty } } = form;

  const watchedValues = watch();

  // Calculate form completion percentage
  const completionPercentage = useMemo(() => {
    if (!showProgress) return 0;
    
    const requiredFields = allFields.filter(field => field.required);
    const completedFields = requiredFields.filter(field => {
      const value = watchedValues[field.id];
      return value !== undefined && value !== null && value !== '';
    });
    
    return requiredFields.length > 0 
      ? Math.round((completedFields.length / requiredFields.length) * 100)
      : 100;
  }, [allFields, watchedValues, showProgress]);

  // Handle conditional field visibility
  const isFieldVisible = useCallback((field: FormField<unknown>) => {
    if (!field.conditional) return true;
    
    const { field: conditionField, value: conditionValue, operator = 'equals' } = field.conditional;
    const fieldValue = watchedValues[conditionField];
    
    switch (operator) {
      case 'equals':
        return fieldValue === conditionValue;
      case 'not-equals':
        return fieldValue !== conditionValue;
      case 'contains':
        return Array.isArray(fieldValue) && fieldValue.includes(conditionValue);
      case 'greater-than':
        return Number(fieldValue) > Number(conditionValue);
      case 'less-than':
        return Number(fieldValue) < Number(conditionValue);
      default:
        return true;
    }
  }, [watchedValues]);

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const onFormSubmit = async (data: T) => {
    try {
      await onSubmit(data);
      if (resetOnSubmit) {
        form.reset();
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Form</CardTitle>
            <CardDescription>
              Please fill out all required fields
            </CardDescription>
          </div>
          
          {showProgress && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{completionPercentage}%</span>
              <Progress value={completionPercentage} className="w-24" />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <AnimatePresence>
            {sections.map((section) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{section.title}</h3>
                    {section.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {section.description}
                      </p>
                    )}
                  </div>
                  
                  {section.collapsible && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSection(section.id)}
                    >
                      {collapsedSections.has(section.id) ? (
                        <Plus className="h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>

                <AnimatePresence>
                  {!collapsedSections.has(section.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                      {section.fields
                        .filter(isFieldVisible)
                        .map((field) => (
                          <Controller
                            key={field.id}
                            name={field.id}
                            control={control}
                            defaultValue={field.defaultValue}
                            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                              <FormFieldWrapper field={field} error={error}>
                                <FieldComponent
                                  field={field}
                                  value={value}
                                  onChange={onChange}
                                  onBlur={onBlur}
                                  error={error}
                                  disabled={disabled || field.disabled}
                                />
                              </FormFieldWrapper>
                            )}
                          />
                        ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex items-center justify-end gap-4 pt-6 border-t">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                {cancelLabel}
              </Button>
            )}
            
            <Button
              type="submit"
              disabled={disabled || loading || !isValid}
              className="min-w-[100px]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 
import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import {
  PencilIcon,
  DollarSign,
  History,
  Droplet,
  Info,
  AlertTriangle,
  PlusCircle,
  Loader2,
} from 'lucide-react';

// API
import { getFuelTypes } from '@/core/api/endpoints/fuel-types';
import { getPrices, createPrice, updatePrice, getPriceHistory } from '@/core/api/endpoints/prices';

// Components
import { WindowContainer } from '@/shared/components/layout/WindowContainer';
import { Button } from '@/core/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/core/components/ui/card';
import { StatsCard } from '@/core/components/ui/cards/stats-card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/core/components/ui/table';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/core/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/ui/select';

// Types
interface FuelType {
  id: string;
  name: string;
  code?: string;
  description?: string;
}

interface FuelPrice {
  id: string;
  fuelTypeId: string;
  price: number;
  effectiveDate: string;
  createdAt: string;
}

// Form schema
const priceFormSchema = z.object({
  fuelTypeId: z.string().min(1, { message: 'Fuel type is required' }),
  price: z.number().positive({ message: 'Price must be positive' }),
  effectiveDate: z.string().min(1, { message: 'Effective date is required' }),
});

type PriceFormValues = z.infer<typeof priceFormSchema>;

export const FuelPricesPage: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddPriceModalOpen, setIsAddPriceModalOpen] = useState(false);
  const [isPriceHistoryModalOpen, setIsPriceHistoryModalOpen] = useState(false);
  const [selectedFuelTypeId, setSelectedFuelTypeId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<FuelPrice | null>(null);
  
  // Form
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<PriceFormValues>({
    resolver: zodResolver(priceFormSchema),
    defaultValues: {
      fuelTypeId: '',
      price: 0,
      effectiveDate: format(new Date(), 'yyyy-MM-dd'),
    }
  });

  // Queries
  const { data: fuelTypes = [], isLoading: isLoadingFuelTypes, error: fuelTypesError } = useQuery({
    queryKey: ['fuelTypes'],
    queryFn: () => getFuelTypes(),
  });

  const { 
    data: prices = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['fuelPrices'],
    queryFn: () => getPrices(),
  });

  const { 
    data: priceHistory = [], 
    isLoading: priceHistoryLoading, 
    error: priceHistoryError,
    refetch: refetchPriceHistory 
  } = useQuery({
    queryKey: ['priceHistory', selectedFuelTypeId],
    queryFn: () => selectedFuelTypeId ? getPriceHistory(selectedFuelTypeId) : Promise.resolve([]),
    enabled: !!selectedFuelTypeId,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createPrice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuelPrices'] });
      setIsAddPriceModalOpen(false);
      reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: updatePrice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuelPrices'] });
      if (selectedFuelTypeId) {
        queryClient.invalidateQueries({ queryKey: ['priceHistory', selectedFuelTypeId] });
      }
      setIsAddPriceModalOpen(false);
      setEditingPrice(null);
      reset();
    },
  });

  // Reset form when editing price changes
  useEffect(() => {
    if (editingPrice) {
      setValue('fuelTypeId', editingPrice.fuelTypeId);
      setValue('price', editingPrice.price);
      setValue('effectiveDate', editingPrice.effectiveDate.split('T')[0]);
    } else {
      reset({
        fuelTypeId: '',
        price: 0,
        effectiveDate: format(new Date(), 'yyyy-MM-dd'),
      });
    }
  }, [editingPrice, setValue, reset]);

  // Filter prices based on search
  const filteredPrices = useMemo(() => {
    if (!searchQuery.trim()) return prices;
    
    return prices.filter((price: FuelPrice) => {
      const fuelType = fuelTypes.find((ft: FuelType) => ft.id === price.fuelTypeId);
      return fuelType?.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [prices, fuelTypes, searchQuery]);

  // Form submission
  const onSubmit = (data: PriceFormValues) => {
    const payload = {
      ...data,
      price: Number(data.price),
    };

    if (editingPrice) {
      updateMutation.mutate({
        id: editingPrice.id,
        ...payload,
      });
    } else {
      createMutation.mutate(payload);
    }
  };

  // Utility functions
  const handleEditPrice = (price: FuelPrice) => {
    setEditingPrice(price);
    setIsAddPriceModalOpen(true);
  };

  const getFuelTypeName = (id: string): string => {
    const fuelType = fuelTypes.find((ft: FuelType) => ft.id === id);
    return fuelType?.name || 'Unknown';
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  const formatCurrency = (value: number): string => {
    return `${value.toLocaleString('hy-AM')} ֏`;
  };

  const getLatestUpdateDate = (): string => {
    if (!prices || prices.length === 0) return '';
    
    // Find the most recent date
    return prices.reduce((latest: string, price: FuelPrice) => {
      const priceDate = new Date(price.effectiveDate);
      const latestDate = latest ? new Date(latest) : new Date(0);
      return priceDate > latestDate ? price.effectiveDate : latest;
    }, '');
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <WindowContainer
      title={t('fuelPrices.title')}
      subtitle={t('fuelPrices.description')}
      breadcrumbItems={[
        { label: t('navigation.dashboard'), href: '/' },
        { label: t('navigation.fuel'), href: '/fuel' },
        { label: t('fuelPrices.title'), href: '/fuel/prices' },
      ]}
    >
      {/* Overview Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t('common.overview')}</CardTitle>
            <Button onClick={() => setIsAddPriceModalOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              {t('fuelPrices.addNewPrice')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard
              title={t('common.fuelTypes')}
              value={fuelTypes?.length || 0}
              icon={<Droplet className="h-4 w-4" />}
            />
            <StatsCard
              title={t('common.priceRecords')}
              value={prices?.length || 0}
              icon={<DollarSign className="h-4 w-4" />}
            />
            <StatsCard
              title={t('common.lastUpdated')}
              value={formatDate(getLatestUpdateDate())}
              icon={<History className="h-4 w-4" />}
            />
          </div>
        </CardContent>
      </Card>

      {/* Price Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t('fuelPrices.currentPrice')}</CardTitle>
            <Input 
              placeholder={t('common.search')}
              className="max-w-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-32 text-destructive">
              <AlertTriangle className="h-8 w-8 mr-2" />
              {t('common.error')}
            </div>
          ) : !prices || prices.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-32">
              <Info className="h-8 w-8 mb-2 text-muted-foreground" />
              <p>{t('common.noFuelPricesFound')}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('common.fuelType')}</TableHead>
                  <TableHead>{t('common.currentPrice')}</TableHead>
                  <TableHead>{t('common.lastUpdated')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrices.map((price: FuelPrice) => (
                  <TableRow key={price.id}>
                    <TableCell className="font-medium">
                      {getFuelTypeName(price.fuelTypeId)}
                    </TableCell>
                    <TableCell>{formatCurrency(price.price)}</TableCell>
                    <TableCell>{formatDate(price.effectiveDate)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEditPrice(price)}>
                        <PencilIcon className="h-4 w-4" />
                        <span className="sr-only">{t('common.edit')}</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setSelectedFuelTypeId(price.fuelTypeId);
                          setIsPriceHistoryModalOpen(true);
                        }}
                      >
                        <History className="h-4 w-4" />
                        <span className="sr-only">{t('common.history')}</span>
                      </Button>
                    </TableCell>
                  </TableRow> 
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Price Modal */}
      <Dialog open={isAddPriceModalOpen} onOpenChange={setIsAddPriceModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPrice ? t('fuelPrices.updatePrice') : t('fuelPrices.addNewPrice')}
            </DialogTitle>
            <DialogDescription>
              {editingPrice 
                ? t('fuelPrices.updateDescription')
                : t('fuelPrices.createDescription')
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="fuelTypeId">{t('common.fuelType')}</Label>
                <Select 
                  disabled={!!editingPrice}
                  onValueChange={(value) => setValue('fuelTypeId', value)}
                  defaultValue={editingPrice?.fuelTypeId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('common.selectFuelType')} />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypes?.map((fuelType: FuelType) => (
                      <SelectItem key={fuelType.id} value={fuelType.id}>
                        {fuelType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.fuelTypeId && (
                  <p className="text-sm text-destructive">{errors.fuelTypeId.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">{t('common.price')} ({t('fuelPrices.perLiter')})</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register('price', { 
                    valueAsNumber: true,
                    required: 'Price is required',
                    min: { value: 0, message: 'Price must be greater than 0' }
                  })}
                />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="effectiveDate">{t('common.effective_date')}</Label>
                <Input
                  id="effectiveDate"
                  type="date"
                  {...register('effectiveDate', { required: 'Effective date is required' })}
                />
                {errors.effectiveDate && (
                  <p className="text-sm text-destructive">{errors.effectiveDate.message}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                reset();
                setEditingPrice(null);
                setIsAddPriceModalOpen(false);
              }}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('common.saving')}
                  </>
                ) : (
                  t('common.save')
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Price History Modal */}
      <Dialog open={isPriceHistoryModalOpen} onOpenChange={setIsPriceHistoryModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {t('fuelPrices.priceHistory')}
            </DialogTitle>
            <DialogDescription>
              {t('fuelPrices.historicalPricesFor', { fuelType: getFuelTypeName(selectedFuelTypeId || '') })}
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[60vh] overflow-y-auto">
            {priceHistoryLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : priceHistoryError ? (
              <div className="flex justify-center items-center h-32 text-destructive">
                <AlertTriangle className="h-8 w-8 mr-2" />
                {t('common.error')}
              </div>
            ) : !priceHistory || priceHistory.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-32">
                <Info className="h-8 w-8 mb-2 text-muted-foreground" />
                <p>{t('common.noFuelPricesFound')}</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('common.price')}</TableHead>
                    <TableHead>{t('common.effective_date')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {priceHistory.map((price: FuelPrice) => (
                    <TableRow key={price.id}>
                      <TableCell>{formatCurrency(price.price)}</TableCell>
                      <TableCell>{formatDate(price.effectiveDate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </WindowContainer>
  );
};

export default FuelPricesPage;

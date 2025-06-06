import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  Edit3, 
  Save, 
  X, 
  History,
  Fuel,
  TrendingUp,
  Plus,
  Clock
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fuelPricesApi } from '@/core/api';
import type { FuelPrice as ApiFuelPrice } from '@/core/api';

type FuelPrice = ApiFuelPrice;

interface PriceHistory {
  date: string;
  price: number;
  change: number;
}

export default function FuelPricesPage() {
  const queryClient = useQueryClient();

  // Fetch fuel prices from Supabase Edge Function
  const { data: fuelPrices = [], isLoading: pricesLoading } = useQuery({
    queryKey: ['fuel-prices'],
    queryFn: async (): Promise<FuelPrice[]> => {
      const response = await fuelPricesApi.getFuelPrices();
      return response.data ?? [];
    },
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [selectedFuelType, setSelectedFuelType] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // Mutation to update a fuel price
  const updatePriceMutation = useMutation({
    mutationFn: ({ id, newPrice }: { id: string; newPrice: number }) =>
      fuelPricesApi.updateFuelPrice(id, { price_per_liter: newPrice }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-prices'] });
      setEditingId(null);
    },
  });

  // Fetch price history when the modal is open
  const { data: priceHistory = [], isLoading: isHistoryLoading } = useQuery({
    queryKey: ['fuel-price-history', selectedFuelType],
    enabled: showHistory && !!selectedFuelType,
    queryFn: async (): Promise<PriceHistory[]> => {
      if (!selectedFuelType) return [];
      const response = await fuelPricesApi.getFuelPrices({ fuel_type: selectedFuelType });
      const list = response.data ?? [];
      const sorted = list.sort((a, b) => new Date(b.effective_date).getTime() - new Date(a.effective_date).getTime());
      return sorted.slice(0, 5).map((item, idx, arr) => ({
        date: item.effective_date,
        price: item.price_per_liter,
        change: idx < arr.length - 1 ? item.price_per_liter - arr[idx + 1].price_per_liter : 0,
      }));
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const handleEditStart = (price: FuelPrice) => {
    setEditingId(price.id);
    setEditPrice(price.price_per_liter);
  };

  const handleEditSave = (id: string) => {
    updatePriceMutation.mutate({ id, newPrice: editPrice });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditPrice(0);
  };

  const showPriceHistory = (fuelType: string) => {
    setSelectedFuelType(fuelType);
    setShowHistory(true);
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-400" />;
    if (change < 0) return <TrendingUp className="h-4 w-4 text-red-400 rotate-180" />;
    return <div className="h-4 w-4" />;
  };

  const breadcrumbItems = [
    { label: 'Home', to: '/' },
    { label: 'Fuel Operations', to: '/fuel' },
    { label: 'Fuel Prices', to: '/fuel/prices' },
  ];

  const fuelTypes = [
    { id: 'type1', name: 'Fuel Type 1', description: 'Description for Fuel Type 1' },
    { id: 'type2', name: 'Fuel Type 2', description: 'Description for Fuel Type 2' },
    { id: 'type3', name: 'Fuel Type 3', description: 'Description for Fuel Type 3' },
  ];

  return (
    <div className="management-container">
      <nav className="breadcrumbs">
        <Link to="/">Home</Link> <span> &gt; </span> 
        <Link to="/fuel">Fuel Operations</Link> <span> &gt; </span> 
        <span>Fuel Prices</span>
      </nav>
      
      <h1 className="management-title">Fuel Pricing Management</h1>
      <p className="management-desc">
        Monitor and update current fuel prices with real-time market tracking and historical analysis.
      </p>

      {/* Current Prices Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Current Fuel Prices</h2>
              <p className="text-sm text-gray-600">Live pricing for all fuel types</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid gap-4">
            {fuelPrices.map((price) => (
              <div key={price.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Fuel className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{price.fuel_type}</h3>
                    <p className="text-sm text-gray-500">
                      Last updated: {formatDate(price.updated_at ?? price.effective_date)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {editingId === price.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.01"
                        value={editPrice}
                        onChange={(e) => setEditPrice(parseFloat(e.target.value))}
                        className="w-24 px-3 py-1 border border-gray-300 rounded-md text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => handleEditSave(price.id)}
                        className="p-2 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                      >
                        <Save className="h-4 w-4 text-green-600" />
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {formatCurrency(price.price_per_liter)}
                        </div>
                        <div className="text-sm text-gray-500">per liter</div>
                      </div>
                      <button
                        onClick={() => handleEditStart(price)}
                        className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                      >
                        <Edit3 className="h-4 w-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => showPriceHistory(price.fuel_type)}
                        className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
                      >
                        <History className="h-4 w-4 text-purple-600" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Price History Modal */}
      {showHistory && selectedFuelType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <History className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Price History</h2>
                    <p className="text-sm text-gray-600">{selectedFuelType} - Last 5 days</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {isHistoryLoading ? (
                  <div>Loading...</div>
                ) : priceHistory.map((history, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="text-gray-900 font-medium">
                      {new Date(history.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-semibold text-gray-900">
                        {formatCurrency(history.price)}
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${
                        history.change > 0 ? 'text-green-600' : 
                        history.change < 0 ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {getChangeIcon(history.change)}
                        <span>{history.change > 0 ? '+' : ''}{formatCurrency(history.change)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

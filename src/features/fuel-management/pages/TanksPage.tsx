/**
 * Tanks Management Page
 * 
 * Comprehensive tank management interface with real-time data,
 * inline editing, and tank level history functionality.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  useTanks, 
  useTankLevelChanges, 
  useTankMutations,
  TANK_QUERY_KEYS 
} from "@/shared/hooks/useTanks";
import type { Tank as FuelTank, TankLevelChange } from "@/shared/types/tank.types";
import { Button } from "@/core/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Input } from "@/core/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/core/components/ui/dialog";
import { useToast } from "@/hooks/useToast";
import { 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Edit3,
  Eye,
  Fuel,
  History,
  Plus,
  Save,
  TrendingDown,
  TrendingUp,
  X 
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Breadcrumb } from '@/shared/components/layout/Breadcrumb';

interface TankLevelHistory {
  date: string;
  level: number;
  change: number;
  reason?: string;
}

export default function TanksPage() {
  // Use tanks features hooks
  const { data: tanks = [], isLoading: tanksLoading } = useTanks();
  const { adjustTankLevel } = useTankMutations();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLevel, setEditLevel] = useState<number>(0);
  const [selectedTank, setSelectedTank] = useState<FuelTank | null>(null);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // Fetch tank level changes when the modal is open
  const { data: levelChanges = [], isLoading: isHistoryLoading } = useTankLevelChanges(
    selectedTank?.id || ''
  );

  // Convert tank level changes to history format
  const levelHistory: TankLevelHistory[] = React.useMemo(() => {
    if (!levelChanges || !Array.isArray(levelChanges)) return [];
    
    return levelChanges.slice(0, 10).map((change) => ({
      date: change.created_at || '',
      level: change.new_level,
      change: change.change_type === 'add' ? change.change_amount : -change.change_amount,
      reason: (change as any).reason || undefined,
    }));
  }, [levelChanges]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatVolume = (volume: number) => {
    return `${volume.toLocaleString()}L`;
  };

  const getCapacityPercentage = (currentLevel: number, capacity: number) => {
    return Math.round((currentLevel / capacity) * 100);
  };

  const getTankStatusColor = (percentage: number) => {
    if (percentage < 10) return 'text-red-600 bg-red-100';
    if (percentage < 25) return 'text-orange-600 bg-orange-100';
    if (percentage < 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getTankStatus = (percentage: number) => {
    if (percentage < 10) return 'Critical';
    if (percentage < 25) return 'Low';
    if (percentage < 50) return 'Medium';
    return 'Good';
  };

  const handleEditStart = (tank: FuelTank) => {
    setEditingId(tank.id);
    setEditLevel(tank.current_level);
  };

  const handleEditSave = (tank: FuelTank) => {
    const changeAmount = Math.abs(editLevel - tank.current_level);
    const changeType = editLevel > tank.current_level ? 'add' : 'subtract';
    
    adjustTankLevel.mutate({ 
      tankId: tank.id, 
      changeAmount,
      changeType,
      reason: 'Manual adjustment'
    });
    setEditingId(null);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditLevel(0);
  };

  const showTankHistory = (tank: FuelTank) => {
    setSelectedTank(tank);
    setShowHistory(true);
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-400" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-400" />;
    return <Activity className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div className="management-container">
      <Breadcrumb 
        items={[
          { label: 'Fuel Operations', href: '/fuel' },
          { label: 'Tank Management' }
        ]}
      />
      
      <h1 className="management-title">Tank Management</h1>
      <p className="management-desc">
        Monitor and manage fuel tank levels with real-time tracking and level adjustment capabilities.
      </p>

      {/* Current Tanks Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Database className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Tank Status Overview</h2>
              <p className="text-sm text-gray-600">Real-time fuel levels and capacity monitoring</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {tanksLoading ? (
            <div className="text-center py-8">Loading tanks...</div>
          ) : (
            <div className="grid gap-4">
              {tanks.map((tank) => {
                const fuelTank = tank as FuelTank;
                const percentage = getCapacityPercentage(fuelTank.current_level, fuelTank.capacity);
                const statusColor = getTankStatusColor(percentage);
                const status = getTankStatus(percentage);
                
                return (
                  <div key={fuelTank.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Fuel className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{fuelTank.name}</h3>
                        <p className="text-sm text-gray-500">
                          {fuelTank.fuel_type?.name || 'Unknown Fuel Type'} | Last updated: {formatDate(fuelTank.updated_at)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                            {status}
                          </span>
                          <span className="text-xs text-gray-500">
                            {percentage}% capacity
                          </span>
                        </div>
                      </div>
                      <div className="w-32">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              percentage < 10 ? 'bg-red-500' :
                              percentage < 25 ? 'bg-orange-500' :
                              percentage < 50 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 text-center">
                          {formatVolume(fuelTank.current_level)} / {formatVolume(fuelTank.capacity)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {editingId === fuelTank.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="1"
                            value={editLevel}
                            onChange={(e) => setEditLevel(parseFloat(e.target.value) || 0)}
                            className="w-24 px-3 py-1 border border-gray-300 rounded-md text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <span className="text-sm text-gray-500">L</span>
                          <button
                            onClick={() => handleEditSave(fuelTank)}
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
                              {formatVolume(fuelTank.current_level)}
                            </div>
                            <div className="text-sm text-gray-500">current level</div>
                          </div>
                          <button
                            onClick={() => handleEditStart(fuelTank)}
                            className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                          >
                            <Edit3 className="h-4 w-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => showTankHistory(fuelTank)}
                            className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
                          >
                            <History className="h-4 w-4 text-purple-600" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Tank Level History Modal */}
      {showHistory && selectedTank && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <History className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Level History</h2>
                    <p className="text-sm text-gray-600">{selectedTank.name} - Recent changes</p>
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
                ) : levelHistory.map((history, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="text-gray-900 font-medium">
                      {new Date(history.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-semibold text-gray-900">
                        {formatVolume(history.level)}
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${
                        history.change > 0 ? 'text-green-600' : 
                        history.change < 0 ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {getChangeIcon(history.change)}
                        <span>
                          {history.change > 0 ? '+' : ''}{formatVolume(Math.abs(history.change))}
                        </span>
                      </div>
                      {history.reason && (
                        <div className="text-xs text-gray-500 italic">
                          {history.reason}
                        </div>
                      )}
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

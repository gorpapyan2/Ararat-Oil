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
import { Breadcrumb } from '@/shared/components/layout/Breadcrumb';
import { NavigationCard } from '@/shared/components/navigation/NavigationCard';

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

  const breadcrumbItems = [
    { label: 'Fuel Operations', href: '/fuel' },
    { label: 'Tank Management' }
  ];

  const tankModules = [
    {
      id: 'tank-status-overview',
      title: 'Tank Status Overview',
      description: 'Real-time fuel levels and capacity monitoring',
      path: '/fuel/tanks',
      color: 'bg-blue-500',
      icon: Database
    },
    {
      id: 'tank-level-history',
      title: 'Tank Level History',
      description: 'View historical changes in tank levels',
      path: '/fuel/tanks/history',
      color: 'bg-purple-500',
      icon: History
    },
    {
      id: 'tank-level-adjustment',
      title: 'Tank Level Adjustment',
      description: 'Manually adjust tank levels',
      path: '/fuel/tanks/adjust',
      color: 'bg-green-500',
      icon: Plus
    },
    {
      id: 'tank-capacity-management',
      title: 'Tank Capacity Management',
      description: 'Manage tank capacity and storage',
      path: '/fuel/tanks/capacity',
      color: 'bg-yellow-500',
      icon: TrendingUp
    },
    {
      id: 'tank-maintenance-scheduling',
      title: 'Tank Maintenance Scheduling',
      description: 'Schedule and manage tank maintenance',
      path: '/fuel/tanks/maintenance',
      color: 'bg-red-500',
      icon: Clock
    }
  ];

  return (
    <div className="subnav-container">
      <div className="subnav-card-window">
        {/* Header with Breadcrumb */}
        <div className="subnav-header">
          <div className="subnav-header-content">
            <div className="subnav-breadcrumb">
              <Breadcrumb items={breadcrumbItems} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="subnav-body">
          <div className="subnav-content">
            {/* Page Title Section */}
            <div className="page-title-section">
              <h1 className="page-title">
                Tank Management System
              </h1>
              <p className="page-description">
                Comprehensive tank monitoring, capacity management, and maintenance scheduling for optimal fuel storage operations.
              </p>
            </div>

            {/* Module Cards */}
            <div className="management-cards">
              {tankModules.map((module) => (
                <NavigationCard
                  key={module.id}
                  title={module.title}
                  description={module.description}
                  href={module.path}
                  color={module.color}
                  icon={module.icon}
                  variant="management"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

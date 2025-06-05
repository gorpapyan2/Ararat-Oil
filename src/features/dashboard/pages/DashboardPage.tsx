/**
 * App Selector Landing Page - Ararat Oil Management System
 * 
 * Features:
 * - Card-based app selection interface
 * - Dark theme with glassmorphism effects
 * - Hover animations and transitions
 * - Simple navigation to different modules
 * 
 * @version 2.0.0
 * @author Ararat Oil Development Team
 * @last-updated 2024
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

import { cn } from '@/shared/utils';

interface SubModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  path: string;
}

interface MainModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconBg: string;
  path: string;
  subModules: SubModule[];
}

export function DashboardPage() {
  const navigate = useNavigate();

  const modules: MainModule[] = [
    {
      id: 'management',
      title: 'Management',
      description: 'Manage employees, shifts, and operations.',
      icon: 'M',
      iconBg: 'bg-gray-500',
      path: '/management',
      subModules: [
        {
          id: 'shifts',
          name: 'Shifts',
          description: 'Employee shift management and scheduling',
          icon: '🕐',
          path: '/management/shifts'
        },
        {
          id: 'employees',
          name: 'Employees',
          description: 'Staff management and employee records',
          icon: '👥',
          path: '/management/employees'
        }
      ]
    },
    {
      id: 'finance',
      title: 'Finance',
      description: 'Complete financial management system.',
      icon: 'F',
      iconBg: 'bg-green-500',
      path: '/finance',
      subModules: [
        {
          id: 'finance-dashboard',
          name: 'Finance Dashboard',
          description: 'Financial overview and analytics',
          icon: '📊',
          path: '/finance/dashboard'
        },
        {
          id: 'sales',
          name: 'Sales',
          description: 'Track fuel sales and daily transactions',
          icon: '💰',
          path: '/finance/sales'
        },
        {
          id: 'expenses',
          name: 'Expenses',
          description: 'Cost management and expense tracking',
          icon: '💸',
          path: '/finance/expenses'
        },
        {
          id: 'revenue',
          name: 'Revenue',
          description: 'Income tracking and revenue analysis',
          icon: '📈',
          path: '/finance/revenue'
        },
        {
          id: 'payment-methods',
          name: 'Payment Methods',
          description: 'Payment processing options and methods',
          icon: '💳',
          path: '/finance/payment-methods'
        }
      ]
    },
    {
      id: 'fuel',
      title: 'Fuel',
      description: 'Complete fuel management and operations.',
      icon: 'F',
      iconBg: 'bg-blue-500',
      path: '/fuel',
      subModules: [
        {
          id: 'fuel-dashboard',
          name: 'Fuel Dashboard',
          description: 'Fuel analytics and overview',
          icon: '⛽',
          path: '/fuel/dashboard'
        },
        {
          id: 'tanks',
          name: 'Tanks',
          description: 'Storage tank management and monitoring',
          icon: '🛢️',
          path: '/fuel/tanks'
        },
        {
          id: 'fuel-supplies',
          name: 'Fuel Supplies',
          description: 'Inventory management and fuel supplies',
          icon: '📦',
          path: '/fuel/supplies'
        },
        {
          id: 'fuel-prices',
          name: 'Fuel Prices',
          description: 'Pricing management and fuel rates',
          icon: '🏷️',
          path: '/fuel/prices'
        },
        {
          id: 'fuel-types',
          name: 'Fuel Types',
          description: 'Product catalog and fuel type management',
          icon: '🔬',
          path: '/fuel/types'
        },
        {
          id: 'filling-systems',
          name: 'Filling Systems',
          description: 'Pump and dispenser management',
          icon: '⚙️',
          path: '/fuel/filling-systems'
        },
        {
          id: 'petrol-providers',
          name: 'Petrol Providers',
          description: 'Supplier management and provider relationships',
          icon: '🚛',
          path: '/fuel/providers'
        }
      ]
    }
  ];

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Content Container - Properly centered within MainLayout */}
      <div className="flex-1 flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white mb-4">
              Hey there!
            </h1>
            <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-300">
              Select an app below to get started.
            </p>
          </div>

          {/* App Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {modules.map((module) => (
              <div
                key={module.id}
                onClick={() => handleCardClick(module.path)}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-3xl p-6 lg:p-8 h-56 lg:h-64 flex flex-col items-center justify-center text-center hover:bg-white/90 dark:hover:bg-slate-800/60 transition-all duration-300 shadow-lg">
                  {/* Icon Container */}
                  <div className={cn(
                    "w-16 lg:w-20 h-16 lg:h-20 rounded-2xl flex items-center justify-center mb-4 lg:mb-6 shadow-lg",
                    module.iconBg
                  )}>
                    <span className="text-2xl lg:text-3xl font-bold text-white">
                      {module.icon}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl lg:text-2xl font-bold text-slate-800 dark:text-white mb-2 lg:mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                    {module.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                    {module.description}
                  </p>

                  {/* Sub-modules count indicator */}
                  <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {module.subModules.length} modules
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="text-center">
            <p className="text-slate-500 dark:text-slate-500 text-sm">
              Ararat Oil Management System • Version 2.0.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

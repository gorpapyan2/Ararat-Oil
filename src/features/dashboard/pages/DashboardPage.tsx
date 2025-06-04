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

interface AppCard {
  id: string;
  title: string;
  description: string;
  color: string;
  href: string;
  letter: string;
}

export function DashboardPage() {
  const navigate = useNavigate();

  const appCards: AppCard[] = [
    {
      id: 'management',
      title: 'Management',
      description: 'Manage employees, shifts, and operations.',
      color: 'bg-gray-500',
      href: '/management',
      letter: 'M'
    },
    {
      id: 'sales',
      title: 'Sales',
      description: 'Track fuel sales and daily transactions.',
      color: 'bg-pink-500',
      href: '/finance/sales',
      letter: 'S'
    },
    {
      id: 'reports',
      title: 'Reports',
      description: 'Generate financial and operational reports.',
      color: 'bg-orange-500',
      href: '/reports',
      letter: 'R'
    },
    {
      id: 'fuel',
      title: 'Fuel Management',
      description: 'Monitor tanks, inventory, and fuel supplies.',
      color: 'bg-blue-500',
      href: '/fuel-management',
      letter: 'F'
    },
    {
      id: 'finance',
      title: 'Finance',
      description: 'Track expenses, revenue, and profitability.',
      color: 'bg-green-500',
      href: '/finance',
      letter: 'F'
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'System configuration and preferences.',
      color: 'bg-purple-500',
      href: '/settings',
      letter: 'S'
    }
  ];

  const handleCardClick = (href: string) => {
    navigate(href);
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
            {appCards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.href)}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-3xl p-6 lg:p-8 h-56 lg:h-64 flex flex-col items-center justify-center text-center hover:bg-white/90 dark:hover:bg-slate-800/60 transition-all duration-300 shadow-lg">
                  {/* Icon Container */}
                  <div className={cn(
                    "w-16 lg:w-20 h-16 lg:h-20 rounded-2xl flex items-center justify-center mb-4 lg:mb-6 shadow-lg",
                    card.color
                  )}>
                    <span className="text-2xl lg:text-3xl font-bold text-white">
                      {card.letter}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl lg:text-2xl font-bold text-slate-800 dark:text-white mb-2 lg:mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                    {card.description}
                  </p>
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

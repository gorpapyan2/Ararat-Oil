import React from 'react';
import { cn } from '@/shared/utils';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<any>;
  color: string;
  description?: string;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  description,
  className = ""
}) => {
  return (
    <div
      className={cn(
        'bg-[#EEEFE7]/40 dark:bg-black/40 backdrop-blur-sm rounded-lg p-4',
        'border border-[#A6A698]/30 dark:border-[#717181]/30',
        'hover:bg-[#EEEFE7]/60 dark:hover:bg-black/60 transition-all duration-300',
        'hover:border-[#E3E263]/40',
        'group cursor-pointer',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-xs text-[#57575E] dark:text-[#A6A698] font-medium uppercase tracking-wider mb-1 truncate">
            {title}
          </h3>
          <p className={cn(
            'text-xl font-bold text-black dark:text-[#EEEFE7] mb-1',
            'group-hover:scale-105 transition-transform duration-300 truncate'
          )}>
            {value}
          </p>
          {description && (
            <p className="text-xs text-[#57575E] dark:text-[#A6A698] leading-relaxed truncate">
              {description}
            </p>
          )}
        </div>
        <div
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ml-3',
            'bg-gradient-to-br shadow-sm group-hover:shadow-md transition-all duration-300',
            'group-hover:scale-110 group-hover:rotate-3',
            color
          )}
        >
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
}; 
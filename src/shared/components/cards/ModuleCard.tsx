import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/shared/utils';

interface ModuleCardProps {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ComponentType<any>;
  badge?: string;
  stats?: {
    count: string;
    label: string;
  };
  color: string;
  bgGradient: string;
  iconGradient: string;
  textColor: string;
  className?: string;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  description,
  path,
  icon: Icon,
  badge,
  stats,
  color,
  bgGradient,
  iconGradient,
  textColor,
  className = ""
}) => {
  return (
    <Link to={path} className="group">
      <div
        className={cn(
          'relative overflow-hidden rounded-xl p-6 h-[16rem] w-full transition-all duration-300',
          'bg-[#EEEFE7]/60 dark:bg-black/60 border border-[#A6A698]/50 dark:border-[#717181]/50',
          'backdrop-blur-sm hover:backdrop-blur-md',
          'hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-[#EEEFE7]/5',
          'hover:border-[#E3E263]/30',
          'flex flex-col',
          bgGradient,
          className
        )}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20 dark:opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#E3E263]/10 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Header with Icon and Badge */}
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <div
              className={cn(
                'p-2.5 rounded-lg transition-all duration-300',
                'bg-gradient-to-br shadow-sm group-hover:shadow-md',
                'group-hover:scale-110 group-hover:rotate-3',
                iconGradient
              )}
            >
              <Icon className="h-5 w-5 text-white" />
            </div>
            
            {badge && (
              <span className={cn(
                'px-2 py-1 text-xs font-medium rounded-full',
                'bg-[#E3E263]/20 text-[#E3E263] border border-[#E3E263]/30',
                'uppercase tracking-wider',
                'flex-shrink-0'
              )}>
                {badge}
              </span>
            )}
          </div>
          
          {/* Title and Description */}
          <div className="flex-1 min-w-0 mb-3">
            <h3 className="text-base font-semibold mb-2 text-black dark:text-[#EEEFE7] group-hover:text-[#E3E263] transition-colors duration-300 line-clamp-2">
              {title}
            </h3>
            <p className="text-xs text-[#57575E] dark:text-[#A6A698] leading-relaxed line-clamp-3 overflow-hidden">
              {description}
            </p>
          </div>

          {/* Stats Footer */}
          {stats && (
            <div className="mt-auto pt-3 border-t border-[#A6A698]/50 dark:border-[#717181]/50 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    'text-lg font-bold transition-colors duration-300 truncate',
                    textColor
                  )}>
                    {stats.count}
                  </div>
                  <div className="text-xs text-[#57575E] dark:text-[#A6A698] uppercase tracking-wide truncate">
                    {stats.label}
                  </div>
                </div>
                <div className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300',
                  'bg-[#E3E263]/10 group-hover:bg-[#E3E263]/20',
                  'flex-shrink-0 ml-3'
                )}>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E3E263] group-hover:translate-x-0.5 transition-transform duration-300" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}; 
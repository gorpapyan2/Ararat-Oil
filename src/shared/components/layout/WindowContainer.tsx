import React from 'react';
import { Breadcrumb } from './Breadcrumb';

interface WindowContainerProps {
  title: string;
  subtitle?: string;
  breadcrumbItems?: Array<{ label: string; href: string }>;
  children: React.ReactNode;
  className?: string;
}

export const WindowContainer: React.FC<WindowContainerProps> = ({
  title,
  subtitle,
  breadcrumbItems = [],
  children,
  className = ""
}) => {
  // Generate default breadcrumbs if none provided
  const defaultBreadcrumbs = breadcrumbItems.length > 0 ? breadcrumbItems : [
    { label: 'Dashboard', href: '/' },
    { label: title, href: '#' }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#EEEFE7] via-[#EEEFE7]/80 to-[#A6A698]/20 dark:from-black dark:via-[#57575E] dark:to-[#717181] p-4 ${className}`}>
      {/* Window Container */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#EEEFE7]/80 dark:bg-black/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-[#A6A698]/20 dark:border-[#717181]/50 overflow-hidden">
          
          {/* Window Header */}
          <div className="bg-gradient-to-r from-[#EEEFE7]/50 to-[#A6A698]/10 dark:from-black/50 dark:to-[#57575E]/50 border-b border-[#A6A698]/30 dark:border-[#717181]/50 p-6">
            <div className="flex items-center justify-between">
              {/* Window Title */}
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-2xl font-bold text-black dark:text-[#EEEFE7]">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-sm text-[#57575E] dark:text-[#A6A698]">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Breadcrumbs in top-right */}
              <div className="flex items-center space-x-4">
                <Breadcrumb items={defaultBreadcrumbs} />
              </div>
            </div>
          </div>

          {/* Window Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}; 
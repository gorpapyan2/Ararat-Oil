import React from 'react';
import { cn } from '@/shared/utils';
import { Activity, AlertCircle, CheckCircle, Clock, WifiOff, Zap } from 'lucide-react';

export type StatusType = 
  | 'online' 
  | 'offline' 
  | 'warning' 
  | 'error' 
  | 'maintenance' 
  | 'syncing' 
  | 'loading'
  | 'success';

export interface StatusIndicatorProps {
  status: StatusType;
  text?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

const statusConfig = {
  online: {
    icon: CheckCircle,
    className: 'bg-energy-green/10 text-energy-green border-energy-green/20',
    pulse: false,
  },
  offline: {
    icon: WifiOff,
    className: 'bg-muted/10 text-muted-foreground border-muted/20',
    pulse: false,
  },
  warning: {
    icon: AlertCircle,
    className: 'bg-warning-orange/10 text-warning-orange border-warning-orange/20',
    pulse: true,
  },
  error: {
    icon: AlertCircle,
    className: 'bg-fuel-red/10 text-fuel-red border-fuel-red/20',
    pulse: true,
  },
  maintenance: {
    icon: Activity,
    className: 'bg-electric-blue/10 text-electric-blue border-electric-blue/20',
    pulse: false,
  },
  syncing: {
    icon: Zap,
    className: 'bg-electric-blue/10 text-electric-blue border-electric-blue/20',
    pulse: true,
  },
  loading: {
    icon: Clock,
    className: 'bg-muted/10 text-muted-foreground border-muted/20',
    pulse: true,
  },
  success: {
    icon: CheckCircle,
    className: 'bg-energy-green/10 text-energy-green border-energy-green/20',
    pulse: false,
  },
};

const sizeConfig = {
  sm: {
    container: 'text-xs px-2 py-1',
    icon: 'h-3 w-3',
    gap: 'gap-1',
  },
  md: {
    container: 'text-sm px-3 py-1.5',
    icon: 'h-4 w-4',
    gap: 'gap-1.5',
  },
  lg: {
    container: 'text-base px-4 py-2',
    icon: 'h-5 w-5',
    gap: 'gap-2',
  },
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  text,
  showIcon = true,
  size = 'md',
  animated = true,
  className,
}) => {
  const config = statusConfig[status];
  const sizeClass = sizeConfig[size];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        'transition-all duration-300',
        config.className,
        sizeClass.container,
        sizeClass.gap,
        {
          'animate-pulse-gentle': animated && config.pulse,
        },
        className
      )}
    >
      {showIcon && (
        <Icon
          className={cn(
            sizeClass.icon,
            'transition-transform duration-300',
            {
              'animate-spin': status === 'syncing' && animated,
              'animate-bounce': status === 'loading' && animated,
            }
          )}
        />
      )}
      {text && <span>{text}</span>}
    </div>
  );
};

// Predefined status indicators for common use cases
export const OnlineStatus: React.FC<Omit<StatusIndicatorProps, 'status'>> = (props) => (
  <StatusIndicator status="online" {...props} />
);

export const OfflineStatus: React.FC<Omit<StatusIndicatorProps, 'status'>> = (props) => (
  <StatusIndicator status="offline" {...props} />
);

export const WarningStatus: React.FC<Omit<StatusIndicatorProps, 'status'>> = (props) => (
  <StatusIndicator status="warning" {...props} />
);

export const ErrorStatus: React.FC<Omit<StatusIndicatorProps, 'status'>> = (props) => (
  <StatusIndicator status="error" {...props} />
);

export const MaintenanceStatus: React.FC<Omit<StatusIndicatorProps, 'status'>> = (props) => (
  <StatusIndicator status="maintenance" {...props} />
);

export const SyncingStatus: React.FC<Omit<StatusIndicatorProps, 'status'>> = (props) => (
  <StatusIndicator status="syncing" {...props} />
);

export const LoadingStatus: React.FC<Omit<StatusIndicatorProps, 'status'>> = (props) => (
  <StatusIndicator status="loading" {...props} />
);

export const SuccessStatus: React.FC<Omit<StatusIndicatorProps, 'status'>> = (props) => (
  <StatusIndicator status="success" {...props} />
); 
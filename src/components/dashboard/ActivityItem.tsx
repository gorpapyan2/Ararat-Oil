import { cn } from "@/lib/utils";
import { CalendarDays, CreditCard, DollarSign, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, formatDistanceToNow } from "date-fns";

interface ActivityItemProps {
  type: 'sale' | 'expense' | 'supply';
  date: string;
  amount?: number;
  description: string;
}

export function ActivityItem({ type, date, amount, description }: ActivityItemProps) {
  return (
    <div className="flex items-start space-x-4 p-3 rounded-lg bg-card-gradient-light dark:bg-card-gradient-dark hover:bg-accent/10 transition-all duration-300 border border-transparent hover:border-brand/10 hover:-translate-y-1 hover:shadow-hover group">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110 ${
        type === 'sale' ? 'bg-gradient-to-br from-green-50 to-accent/10 dark:from-green-900/20 dark:to-accent/20' : 
        type === 'expense' ? 'bg-gradient-to-br from-red-50 to-error/10 dark:from-red-900/20 dark:to-error/20' : 'bg-gradient-to-br from-blue-50 to-blue-500/10 dark:from-blue-900/20 dark:to-blue-500/20'
      }`}>
        {type === 'sale' && <DollarSign className="h-4 w-4 text-accent group-hover:animate-pulse-subtle" />}
        {type === 'expense' && <CreditCard className="h-4 w-4 text-error group-hover:animate-pulse-subtle" />}
        {type === 'supply' && <Package className="h-4 w-4 text-blue-500 group-hover:animate-pulse-subtle" />}
      </div>
      
      <div className="space-y-1 flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium group-hover:text-primary transition-colors duration-300">{description}</p>
          <time className="text-xs text-muted-foreground transition-all duration-300 group-hover:opacity-100 opacity-80">{formatDistanceToNow(new Date(date), { addSuffix: true })}</time>
        </div>
        
        <p className="text-sm font-bold transition-all duration-300 group-hover:text-accent/90 group-hover:translate-x-1">
          {type === 'expense' ? '-' : type === 'sale' ? '+' : ''}
          {amount !== undefined ? amount.toLocaleString() : '0'} ֏
        </p>
        
        <div className="flex items-center text-xs text-muted-foreground">
          <CalendarDays className="h-3 w-3 mr-1" />
          {format(parseISO(date), 'PPP')}
        </div>
        
        <div className="h-0.5 w-0 group-hover:w-full bg-accent/20 transition-all duration-500 rounded-full"></div>
      </div>
    </div>
  );
}

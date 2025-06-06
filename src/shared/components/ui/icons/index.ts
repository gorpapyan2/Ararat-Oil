// Centralized Icon Management System
// This file consolidates all icon imports to enable better tree-shaking and bundle optimization

import {
  // Dashboard & Navigation
  LayoutDashboard,
  Home,
  Menu,
  X,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  Grid,
  Table,
  
  // User & Management
  Users,
  User,
  UserPlus,
  UserCheck,
  UserX,
  UserRound,
  
  // Finance & Business
  DollarSign,
  CreditCard,
  Banknote,
  Wallet,
  PiggyBank,
  Calculator,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Target,
  Activity,
  Percent,
  
  // Fuel & Operations
  Fuel,
  Gauge,
  Droplets,
  Package,
  Truck,
  Factory,
  Building,
  Building2,
  Database,
  
  // Time & Calendar
  Calendar,
  CalendarDays,
  CalendarIcon,
  CalendarClock,
  Clock,
  
  // Actions & Controls
  Plus,
  Save,
  Edit,
  Edit3,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Eye,
  EyeOff,
  
  // Status & Alerts
  CheckCircle,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Bell,
  
  // Communication
  Mail,
  Phone,
  MessageCircle,
  
  // Settings & Security
  Settings,
  Lock,
  Shield,
  Key,
  
  // Theme & UI
  Sun,
  Moon,
  Monitor,
  Palette,
  Type,
  Layout,
  
  // Loading & Progress
  Loader2,
  Zap,
  
  // Location & Navigation
  MapPin,
  Globe,
  
  // File & Document
  FileText,
  Receipt,
  Archive,
  Bookmark,
  
  // Technology & Devices
  Smartphone,
  Wifi,
  WifiOff,
  Cloud,
  HardDrive,
  
  // Data & Analytics
  FileCheck,
  Receipt as ReceiptIcon,
  Bug,
  Grid3X3,
  
  // Specialized
  ShoppingCart,
  Wrench,
  Lightbulb,
  Car,
  Thermometer,
  Minus,
  Award,
  
  // Form Controls
  Check,
  ChevronsUpDown,
  Command,
  RotateCcw,
  Pencil,
  Ban,
  HelpCircle,
  Upload as UploadIcon,
  
  // Additional UI Icons
  ArrowUpRight,
  ArrowDownRight,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Tag,
  Circle,
  SlidersHorizontal,
  PanelLeft,
  LogOut,
  SunMedium,
  Laptop,
  
  // Type exports
  type LucideIcon
} from 'lucide-react';

// Export individual icons with descriptive names
export {
  // Core Navigation
  LayoutDashboard as DashboardIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
  X as CloseIcon,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
  ArrowRight as ArrowRightIcon,
  
  // Data Display
  Grid as GridIcon,
  Table as TableIcon,
  BarChart3 as BarChartIcon,
  PieChart as PieChartIcon,
  
  // User Management
  Users as UsersIcon,
  User as UserIcon,
  UserPlus as UserPlusIcon,
  UserCheck as UserCheckIcon,
  UserX as UserXIcon,
  
  // Financial
  DollarSign as DollarIcon,
  CreditCard as CreditCardIcon,
  Banknote as BanknoteIcon,
  Wallet as WalletIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  
  // Operational
  Fuel as FuelIcon,
  Gauge as GaugeIcon,
  Package as PackageIcon,
  Truck as TruckIcon,
  
  // Actions
  Plus as PlusIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Trash2 as DeleteIcon,
  Search as SearchIcon,
  RefreshCw as RefreshIcon,
  
  // Status
  CheckCircle as SuccessIcon,
  XCircle as ErrorIcon,
  AlertCircle as WarningIcon,
  AlertTriangle as AlertIcon,
  
  // Loading
  Loader2 as LoadingIcon,
  
  // Time
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  
  // Communication
  Mail as MailIcon,
  Phone as PhoneIcon,
  
  // Theme
  Sun as SunIcon,
  Moon as MoonIcon,
  Monitor as MonitorIcon,
  
  // Type export
  type LucideIcon
};

// Grouped icon collections for easier imports
export const NavigationIcons = {
  Dashboard: LayoutDashboard,
  Home,
  Menu,
  Close: X,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Grid,
  Table
} as const;

export const UserIcons = {
  Users,
  User,
  UserPlus,
  UserCheck,
  UserX
} as const;

export const FinanceIcons = {
  Dollar: DollarSign,
  CreditCard,
  Banknote,
  Wallet,
  TrendingUp,
  TrendingDown,
  BarChart: BarChart3,
  PieChart,
  Calculator
} as const;

export const OperationalIcons = {
  Fuel,
  Gauge,
  Package,
  Truck,
  Building,
  Database
} as const;

export const ActionIcons = {
  Plus,
  Save,
  Edit,
  Delete: Trash2,
  Search,
  Filter,
  Refresh: RefreshCw,
  Eye,
  EyeOff
} as const;

export const StatusIcons = {
  Success: CheckCircle,
  Error: XCircle,
  Warning: AlertCircle,
  Alert: AlertTriangle,
  Info,
  Loading: Loader2
} as const;

export const TimeIcons = {
  Calendar,
  CalendarDays,
  Clock
} as const;

export const ThemeIcons = {
  Sun,
  Moon,
  Monitor
} as const;

// Helper function to get icon by name (useful for dynamic icon loading)
export const getIconByName = (iconName: string): LucideIcon | null => {
  const iconMap: Record<string, LucideIcon> = {
    dashboard: LayoutDashboard,
    home: Home,
    users: Users,
    user: User,
    fuel: Fuel,
    dollar: DollarSign,
    chart: BarChart3,
    plus: Plus,
    edit: Edit,
    delete: Trash2,
    search: Search,
    loading: Loader2,
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    calendar: Calendar,
    clock: Clock
  };
  
  return iconMap[iconName.toLowerCase()] || null;
};

// Default export for backward compatibility
export default {
  NavigationIcons,
  UserIcons,
  FinanceIcons,
  OperationalIcons,
  ActionIcons,
  StatusIcons,
  TimeIcons,
  ThemeIcons,
  getIconByName
}; 
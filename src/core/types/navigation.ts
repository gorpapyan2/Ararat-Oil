
import { LucideIcon } from "lucide-react";

export interface NavigationFeature {
  title: string;
  description: string;
  path: string;
  icon: LucideIcon;
  color: string;
  status: string;
  metrics?: {
    label: string;
    value: string;
    color?: string;
    trend?: string;
  };
  tags?: string[];
  children?: NavigationFeature[];
}

export interface NavigationSection {
  title: string;
  features: NavigationFeature[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

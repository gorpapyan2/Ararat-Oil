import { cn } from "@/lib/utils";

interface SidebarLogoProps {
  collapsed: boolean;
}

export function SidebarLogo({ collapsed }: SidebarLogoProps) {
  return (
    <div
      className={cn(
        "h-16 flex items-center px-4 border-b",
        collapsed ? "justify-center" : "justify-between",
      )}
    >
      {!collapsed ? (
        <span className="font-heading font-bold text-xl">Ararat Oil</span>
      ) : (
        <span className="font-heading font-bold text-accent text-lg">AO</span>
      )}
    </div>
  );
}

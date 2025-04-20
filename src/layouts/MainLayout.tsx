
import { Sidebar } from "./Sidebar";
import { Toaster } from "@/components/ui/toaster";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
      <Toaster />
    </div>
  );
};

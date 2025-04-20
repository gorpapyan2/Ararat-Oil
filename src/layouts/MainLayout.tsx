
import { Sidebar } from "./Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ThemeProvider } from "next-themes";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <ThemeProvider defaultTheme="system" enableSystem>
      <div className="min-h-screen flex dark:bg-gray-900">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          {children}
        </main>
        <Toaster />
      </div>
    </ThemeProvider>
  );
};

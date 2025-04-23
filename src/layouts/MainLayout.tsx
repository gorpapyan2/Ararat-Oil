import { Sidebar } from "./Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { ThemeToggle } from "@/components/ThemeToggle";
import UserMenu from "@/components/ui/UserMenu";
import { ThemeProvider } from "next-themes";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen flex bg-page-gradient-light dark:bg-page-gradient-dark backdrop-blur-sm bg-opacity-95 dark:bg-opacity-90">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto">
          <div className="flex justify-end items-center gap-2 mb-4">
            <ThemeToggle />
            <UserMenu />
          </div>
          {children}
        </main>
        <Toaster />
      </div>
    </ThemeProvider>
  );
};

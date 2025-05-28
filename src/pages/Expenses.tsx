import { ExpenseManagerStandardized } from "@/features/finance/components/ExpenseManagerStandardized";
import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";
import { useFinance } from "@/features/finance/hooks/useFinance";
import { useMemo } from "react";

const Expenses = () => {
  const { expenses, isLoadingExpenses } = useFinance();
  
  const breadcrumbSegments = useMemo(
    () => [
      { name: "Dashboard", href: "/" },
      { name: "Expenses", href: "/expenses", isCurrent: true },
    ],
    []
  );

  usePageBreadcrumbs({
    segments: breadcrumbSegments,
    title: "Expenses",
  });

  return (
    <div className="space-y-6">
      <ExpenseManagerStandardized expenses={expenses} isLoading={isLoadingExpenses} />
    </div>
  );
};

export default Expenses;

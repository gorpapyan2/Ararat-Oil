import { ExpensesManagerStandardized } from "@/components/expenses/ExpensesManagerStandardized";
import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";
import { useMemo } from "react";

const Expenses = () => {
  const breadcrumbSegments = useMemo(() => [
    { name: "Dashboard", href: "/" },
    { name: "Expenses", href: "/expenses", isCurrent: true }
  ], []);

  usePageBreadcrumbs({
    segments: breadcrumbSegments,
    title: "Expenses"
  });

  return (
    <div className="space-y-6">
      <ExpensesManagerStandardized />
    </div>
  );
};

export default Expenses;

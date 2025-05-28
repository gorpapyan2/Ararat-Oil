import { ExpenseManagerStandardized } from "@/features/finance/components/ExpenseManagerStandardized";
import { PageLayout } from "@/layouts/PageLayout";
import { useTranslation } from "react-i18next";
import { useFinance } from "@/features/finance/hooks/useFinance";

const ExpensesPage = () => {
  const { t } = useTranslation();
  const { expenses, isLoadingExpenses } = useFinance();

  // We need to use translation keys instead of direct values since PageLayout expects keys
  const titleKey = "finance.expenses.title";
  const descriptionKey = "finance.expenses.description";

  return (
    <PageLayout titleKey={titleKey} descriptionKey={descriptionKey}>
      <div className="space-y-6">
        <ExpenseManagerStandardized expenses={expenses} isLoading={isLoadingExpenses} />
      </div>
    </PageLayout>
  );
};

export default ExpensesPage;

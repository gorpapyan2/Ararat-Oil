import { ExpensesManagerStandardized } from "@/components/expenses/ExpensesManagerStandardized";
import { PageLayout } from "@/layouts/PageLayout";
import { useTranslation } from "react-i18next";

const ExpensesPage = () => {
  const { t } = useTranslation();

  return (
    <PageLayout
      titleKey="finance.expenses.title"
      descriptionKey="finance.expenses.description"
    >
      <div className="space-y-6">
        <ExpensesManagerStandardized />
      </div>
    </PageLayout>
  );
};

export default ExpensesPage; 
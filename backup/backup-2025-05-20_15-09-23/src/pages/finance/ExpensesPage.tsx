import { ExpensesManagerStandardized } from "@/features/finance/components/ExpensesManagerStandardized";
import { PageLayout } from "@/layouts/PageLayout";
import { useTranslation } from "react-i18next";
import { apiNamespaces, getApiActionLabel } from "@/i18n/i18n";

const ExpensesPage = () => {
  const { t } = useTranslation();
  
  // We need to use translation keys instead of direct values since PageLayout expects keys
  const titleKey = "finance.expenses.title";
  const descriptionKey = "finance.expenses.description";

  return (
    <PageLayout
      titleKey={titleKey}
      descriptionKey={descriptionKey}
    >
      <div className="space-y-6">
        <ExpensesManagerStandardized />
      </div>
    </PageLayout>
  );
};

export default ExpensesPage; 
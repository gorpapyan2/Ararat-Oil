import { UnifiedDataManager } from "@/components/unified/UnifiedDataManager";
import { PageLayout } from "@/layouts/PageLayout";
import { Database } from "lucide-react";

const UnifiedData = () => {
  return (
    <PageLayout
      titleKey="unifiedData.title"
      descriptionKey="unifiedData.description"
      icon={Database}
    >
      <UnifiedDataManager />
    </PageLayout>
  );
};

export default UnifiedData; 
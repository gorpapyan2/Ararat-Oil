import { FillingSystemManager } from "@/components/filling-systems/FillingSystemManager";
import { PageLayout } from "@/layouts/PageLayout";
import { Fuel } from "lucide-react";

export default function FillingSystems() {
  return (
    <PageLayout
      titleKey="fillingSystems.title"
      descriptionKey="fillingSystems.description"
      icon={Fuel}
    >
      <FillingSystemManager />
    </PageLayout>
  );
}

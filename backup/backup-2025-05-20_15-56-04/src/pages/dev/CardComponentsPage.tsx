import React from "react";
import { PageLayout } from "@/layouts/PageLayout";
import { CardComponentsTester } from "@/shared/components/dev/CardComponentsTester";

export default function CardComponentsPage() {
  return (
    <PageLayout
      titleKey="Card Components Gallery"
      descriptionKey="Explore our unified card component system"
      className="container mx-auto py-8"
    >
      <CardComponentsTester />
    </PageLayout>
  );
} 
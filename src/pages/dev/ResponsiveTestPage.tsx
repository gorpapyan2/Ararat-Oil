import React from "react";
import { ResponsiveTester } from "@/components/dev/ResponsiveTester";
import { PageLayout } from "@/layouts/PageLayout";

export default function ResponsiveTestPage() {
  return (
    <PageLayout
      titleKey="responsiveTest.title"
      descriptionKey="responsiveTest.description"
    >
      <ResponsiveTester />
    </PageLayout>
  );
} 
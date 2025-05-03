import React from "react";
import { ResponsiveTester } from "@/components/ResponsiveTester";
import { PageLayout } from "@/layouts/PageLayout";

export default function ResponsiveTestPage() {
  return (
    <PageLayout
      title="Responsive Hooks Tester"
      subtitle="Test and visualize the responsive hooks capabilities"
      className="container mx-auto py-8"
    >
      <ResponsiveTester />
    </PageLayout>
  );
} 
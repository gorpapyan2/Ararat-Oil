import React from "react";
import { ToastTester } from "@/components/dev/ToastTester";
import { PageLayout } from "@/layouts/PageLayout";

/**
 * A page to test toast notifications with various styles and behaviors
 */
export default function ToastTesterPage() {
  return (
    <PageLayout
      titleKey="Toast Tester"
      descriptionKey="Test different toast notification styles and behaviors"
    >
      <ToastTester />
    </PageLayout>
  );
} 
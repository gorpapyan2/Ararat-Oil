
import { useState } from "react";
import { useToast } from "@/hooks";
import { useTranslation } from "react-i18next";

export default function PetrolProviders() {
  const { toast } = useToast();
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Petrol Providers</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Petrol providers management coming soon...</p>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { TankManager } from "@/components/tanks/TankManager";
import { PageLayout } from "@/layouts/PageLayout";
import { Fuel } from "lucide-react";

export function Tanks() {
  const [action, setAction] = useState<React.ReactNode>(null);

  return (
    <PageLayout
      titleKey="tanks.title"
      descriptionKey="tanks.description"
      icon={Fuel}
      action={action}
    >
      <TankManager onRenderAction={setAction} />
    </PageLayout>
  );
}

export default Tanks;

import { DevToolsMenu } from "@/components/dev/dev-tools-menu";
import { useEffect, useState } from "react";

export default function DevToolsPage() {
  // Only render on client-side to prevent any server/client hydration issues
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div>
      {isMounted && <DevToolsMenu />}
    </div>
  );
} 
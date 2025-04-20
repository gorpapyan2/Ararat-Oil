
import { useQuery } from "@tanstack/react-query";
import { fetchTankLevelChanges } from "@/services/supabase";
import { History } from "lucide-react";

interface TankHistoryProps {
  tankId: string;
}

export function TankHistory({ tankId }: TankHistoryProps) {
  const { data: changes, isLoading } = useQuery({
    queryKey: ['tank-level-changes', tankId],
    queryFn: () => fetchTankLevelChanges(tankId),
    staleTime: 0,
    refetchOnWindowFocus: true
  });

  if (isLoading) {
    return (
      <div className="flex items-center py-2 text-muted-foreground">
        <History className="mr-2 w-4 h-4" />
        Loading history...
      </div>
    );
  }

  if (!changes || changes.length === 0) {
    return (
      <div className="flex items-center py-2 text-muted-foreground">
        <History className="mr-2 w-4 h-4" />
        No changes recorded yet
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-2 text-muted-foreground font-medium">
        <History className="mr-2 w-4 h-4" />
        Change History
      </div>
      <ul className="space-y-1 max-h-32 overflow-y-auto">
        {changes.map((change) => (
          <li key={change.id} className="flex items-center text-xs">
            <span className={change.change_type === "add" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
              {change.change_type === "add" ? "+" : "-"}
              {Number(change.change_amount).toLocaleString()} liters
            </span>
            <span className="mx-1 text-muted-foreground">
              (from {Number(change.previous_level).toLocaleString()} to {Number(change.new_level).toLocaleString()}) •
            </span>
            <span className="ml-1">{change.created_at ? new Date(change.created_at).toLocaleString() : ""}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

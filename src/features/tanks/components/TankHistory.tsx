import { useQuery } from "@tanstack/react-query";
import { tanksService } from "../services/tanksService";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface TankHistoryProps {
  tankId: string;
}

export function TankHistory({ tankId }: TankHistoryProps) {
  const { t } = useTranslation();
  const { data: levelChanges, isLoading } = useQuery({
    queryKey: ["tank-level-changes", tankId],
    queryFn: () => tanksService.getTankLevelChanges(tankId),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (!levelChanges?.length) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        {t("tanks.noHistoryFound")}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("common.date")}</TableHead>
            <TableHead>{t("common.type")}</TableHead>
            <TableHead>{t("common.amount")}</TableHead>
            <TableHead>{t("common.previousLevel")}</TableHead>
            <TableHead>{t("common.newLevel")}</TableHead>
            <TableHead>{t("common.notes")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {levelChanges.map((change) => (
            <TableRow key={change.id}>
              <TableCell>
                {format(new Date(change.created_at), "PPp")}
              </TableCell>
              <TableCell>
                <span
                  className={`inline-block px-2 py-1 rounded text-sm ${
                    change.change_type === "add"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {change.change_type === "add" ? t("tanks.add") : t("tanks.subtract")}
                </span>
              </TableCell>
              <TableCell>{change.change_amount} {t("common.liters")}</TableCell>
              <TableCell>{change.previous_level} {t("common.liters")}</TableCell>
              <TableCell>{change.new_level} {t("common.liters")}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                {change.reason || "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 
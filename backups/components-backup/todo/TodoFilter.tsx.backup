import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Search, ArrowUpDown, Check, ListFilter } from "lucide-react";
import { FilterType, SortType } from "@/types/todo";
import { useTranslation } from "react-i18next";

interface TodoFilterProps {
  filter: FilterType;
  sort: SortType;
  search: string;
  onFilterChange: (filter: FilterType) => void;
  onSortChange: (sort: SortType) => void;
  onSearchChange: (search: string) => void;
  totalTodos: number;
  activeTodos: number;
  completedTodos: number;
}

export function TodoFilter({
  filter,
  sort,
  search,
  onFilterChange,
  onSortChange,
  onSearchChange,
  totalTodos,
  activeTodos,
  completedTodos,
}: TodoFilterProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("todo.search")}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
            aria-label={t("todo.search")}
          />
        </div>
        <Select
          value={sort}
          onValueChange={onSortChange}
          aria-label={t("todo.sortBy")}
        >
          <SelectTrigger className="w-[180px]">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            <SelectValue placeholder={t("todo.sortBy")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">
              <div className="flex items-center">
                <span>{t("todo.sortByDateDesc")}</span>
                {sort === "newest" && <Check className="ml-auto h-4 w-4" />}
              </div>
            </SelectItem>
            <SelectItem value="oldest">
              <div className="flex items-center">
                <span>{t("todo.sortByDateAsc")}</span>
                {sort === "oldest" && <Check className="ml-auto h-4 w-4" />}
              </div>
            </SelectItem>
            <SelectItem value="alphabetical">
              <div className="flex items-center">
                <span>{t("todo.sortByAlphabetical")}</span>
                {sort === "alphabetical" && <Check className="ml-auto h-4 w-4" />}
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <ToggleGroup
          type="single"
          value={filter}
          onValueChange={(value) => {
            if (value) onFilterChange(value as FilterType);
          }}
          className="flex border rounded-md"
          aria-label={t("todo.filterTasks")}
        >
          <ToggleGroupItem
            value="all"
            aria-label={t("todo.all")}
            className="flex-1 px-3 py-1 text-xs sm:px-4"
          >
            <div className="flex items-center justify-center gap-1">
              <ListFilter className="h-3 w-3" />
              <span>{t("todo.all")}</span>
              <span className="ml-1 text-xs rounded-full bg-muted px-1.5">
                {totalTodos}
              </span>
            </div>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="active"
            aria-label={t("todo.active")}
            className="flex-1 px-3 py-1 text-xs sm:px-4"
          >
            <div className="flex items-center justify-center gap-1">
              <ListFilter className="h-3 w-3" />
              <span>{t("todo.active")}</span>
              <span className="ml-1 text-xs rounded-full bg-muted px-1.5">
                {activeTodos}
              </span>
            </div>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="completed"
            aria-label={t("todo.completed")}
            className="flex-1 px-3 py-1 text-xs sm:px-4"
          >
            <div className="flex items-center justify-center gap-1">
              <ListFilter className="h-3 w-3" />
              <span>{t("todo.completed")}</span>
              <span className="ml-1 text-xs rounded-full bg-muted px-1.5">
                {completedTodos}
              </span>
            </div>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilterType, SortType } from "@/types/todo";
import { useTranslation } from "react-i18next";

interface TodoFilterStandardizedProps {
  filter: FilterType;
  sort: SortType;
  search: string;
  totalTodos: number;
  activeTodos: number;
  completedTodos: number;
  onFilterChange: (filter: FilterType) => void;
  onSortChange: (sort: SortType) => void;
  onSearchChange: (search: string) => void;
}

export function TodoFilterStandardized({
  filter,
  sort,
  search,
  totalTodos,
  activeTodos,
  completedTodos,
  onFilterChange,
  onSortChange,
  onSearchChange,
}: TodoFilterStandardizedProps) {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState(search);

  // Handle input change with debounce
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    
    // Use simple debounce to avoid too many state updates
    const timeoutId = setTimeout(() => {
      onSearchChange(value);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div>
        <Input
          type="text"
          placeholder={t("todo.searchPlaceholder")}
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Filter tabs */}
        <Tabs
          value={filter}
          onValueChange={(value) => onFilterChange(value as FilterType)}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">
              {t("todo.all")} ({totalTodos})
            </TabsTrigger>
            <TabsTrigger value="active">
              {t("todo.active")} ({activeTodos})
            </TabsTrigger>
            <TabsTrigger value="completed">
              {t("todo.completed")} ({completedTodos})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Sort select */}
        <Select
          value={sort}
          onValueChange={(value) => onSortChange(value as SortType)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={t("todo.sortBy")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">{t("todo.newest")}</SelectItem>
            <SelectItem value="date-asc">{t("todo.oldest")}</SelectItem>
            <SelectItem value="priority">{t("todo.priority.label")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 
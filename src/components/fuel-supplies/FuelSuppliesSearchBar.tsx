
import { SearchBar } from "@/components/ui/SearchBar";

interface FuelSuppliesSearchBarProps {
  value: string;
  onChange: (v: string) => void;
}

export function FuelSuppliesSearchBar({ value, onChange }: FuelSuppliesSearchBarProps) {
  return (
    <SearchBar
      value={value}
      onChange={onChange}
      placeholder="Search supplies by provider, tank, or date..."
      className="h-9 w-full"
    />
  );
}

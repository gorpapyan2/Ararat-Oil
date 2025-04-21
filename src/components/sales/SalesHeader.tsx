
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SalesForm } from "./SalesForm";
import { useState } from "react";
import { createSale } from "@/services/sales";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { SearchBar } from "@/components/ui/SearchBar";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Search } from "lucide-react";
import { FillingSystemSelect } from "./FillingSystemSelect";
import React from "react";

interface SalesHeaderProps {
  search: string;
  onSearchChange: (search: string) => void;
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  systemId: string;
  onSystemChange: (id: string) => void;
  systems: { id: string; name: string }[];
  litersRange: [number, number];
  onLitersRangeChange: (range: [number, number]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  totalSalesRange: [number, number];
  onTotalSalesRangeChange: (range: [number, number]) => void;
}

export function SalesHeader({
  search,
  onSearchChange,
  date,
  onDateChange,
  systemId,
  onSystemChange,
  systems,
  litersRange,
  onLitersRangeChange,
  priceRange,
  onPriceRangeChange,
  totalSalesRange,
  onTotalSalesRangeChange,
}: SalesHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (data: any) => {
    try {
      await createSale(data);
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['fuel-tanks'] });
      queryClient.invalidateQueries({ queryKey: ['latest-sale'] });

      toast({
        title: "Success",
        description: "Sale created successfully and tank level updated",
      });

      setIsOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create sale",
        variant: "destructive",
      });
      console.error("Error creating sale:", error);
    }
  };

  const handleRangeChange = (
    idx: number,
    value: string,
    range: [number, number],
    setRange: (r: [number, number]) => void
  ) => {
    const newVal = value === "" ? "" : Number(value);
    const updated: [number, number] = [range[0], range[1]];
    updated[idx] = newVal as number;
    setRange(updated);
  };

  return (
    <div className="flex flex-col space-y-6 bg-background">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Sales</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage and track fuel sales records</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="h-9 px-4 rounded-md shadow-sm flex items-center gap-1.5 transition-all hover:shadow">
              <Plus className="h-4 w-4" />
              <span>Add Sale</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <SalesForm onSubmit={handleSubmit} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Search bar */}
        <div className="md:col-span-3 lg:col-span-2">
          <SearchBar
            value={search}
            onChange={onSearchChange}
            placeholder="Search by system, fuel, or date…"
            className="h-9 w-full"
          />
        </div>

        {/* Date Picker */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`h-9 px-3 py-2 justify-start text-left font-normal ${!date ? "text-muted-foreground" : ""}`}
              >
                <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                {date ? format(date, "PPP") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={onDateChange}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Filling System select */}
        <FillingSystemSelect
          value={systemId}
          onChange={onSystemChange}
          systems={systems}
        />
      </div>

      {/* Ranges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Liters Range */}
        <div className="p-3 rounded-md border bg-background/50">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground">Liters Range</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                className="h-9 flex-1 px-3 py-1 rounded-md border border-input bg-background text-sm"
                value={litersRange[0] === 0 ? "" : litersRange[0]}
                onChange={e => handleRangeChange(0, e.target.value, litersRange, onLitersRangeChange)}
              />
              <span className="text-muted-foreground">-</span>
              <input
                type="number"
                placeholder="Max"
                className="h-9 flex-1 px-3 py-1 rounded-md border border-input bg-background text-sm"
                value={litersRange[1] === 0 ? "" : litersRange[1]}
                onChange={e => handleRangeChange(1, e.target.value, litersRange, onLitersRangeChange)}
              />
            </div>
          </div>
        </div>

        {/* Price Range */}
        <div className="p-3 rounded-md border bg-background/50">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground">Price/Unit Range (֏)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                className="h-9 flex-1 px-3 py-1 rounded-md border border-input bg-background text-sm"
                value={priceRange[0] === 0 ? "" : priceRange[0]}
                onChange={e => handleRangeChange(0, e.target.value, priceRange, onPriceRangeChange)}
              />
              <span className="text-muted-foreground">-</span>
              <input
                type="number"
                placeholder="Max"
                className="h-9 flex-1 px-3 py-1 rounded-md border border-input bg-background text-sm"
                value={priceRange[1] === 0 ? "" : priceRange[1]}
                onChange={e => handleRangeChange(1, e.target.value, priceRange, onPriceRangeChange)}
              />
            </div>
          </div>
        </div>

        {/* Total Sales Range */}
        <div className="p-3 rounded-md border bg-background/50">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground">Total Sales Range (֏)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                className="h-9 flex-1 px-3 py-1 rounded-md border border-input bg-background text-sm"
                value={totalSalesRange[0] === 0 ? "" : totalSalesRange[0]}
                onChange={e => handleRangeChange(0, e.target.value, totalSalesRange, onTotalSalesRangeChange)}
              />
              <span className="text-muted-foreground">-</span>
              <input
                type="number"
                placeholder="Max"
                className="h-9 flex-1 px-3 py-1 rounded-md border border-input bg-background text-sm"
                value={totalSalesRange[1] === 0 ? "" : totalSalesRange[1]}
                onChange={e => handleRangeChange(1, e.target.value, totalSalesRange, onTotalSalesRangeChange)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


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
import { Calendar as CalendarIcon } from "lucide-react";
import { FillingSystemSelect } from "./FillingSystemSelect";
import React from "react";

interface SalesHeaderProps {
  search: string;
  onSearchChange: (search: string) => void;
  // New: filter values & handlers
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

  // Range input helpers
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
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Sales</h2>
        <p className="text-muted-foreground">View and manage fuel sales</p>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <SearchBar
          value={search}
          onChange={onSearchChange}
          placeholder="Search by system, fuel, or date…"
          className="w-56"
        />

        {/* Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={`w-[145px] justify-start text-left font-normal ${!date ? "text-muted-foreground" : ""}`}
            >
              <span className="mr-1">{/* Calendar icon */}</span>
              {date ? format(date, "PPP") : <span>Date</span>}
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

        {/* Filling System select */}
        <FillingSystemSelect
          value={systemId}
          onChange={onSystemChange}
          systems={systems}
          className="w-36"
        />

        {/* Range filters */}
        <div className="flex flex-col min-w-[160px]">
          <label className="text-xs text-muted-foreground">Liters</label>
          <div className="flex gap-1">
            <input
              type="number"
              placeholder="Min"
              className="w-14 border px-1 py-0.5 rounded"
              value={litersRange[0] === 0 ? "" : litersRange[0]}
              onChange={e => handleRangeChange(0, e.target.value, litersRange, onLitersRangeChange)}
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              className="w-14 border px-1 py-0.5 rounded"
              value={litersRange[1] === 0 ? "" : litersRange[1]}
              onChange={e => handleRangeChange(1, e.target.value, litersRange, onLitersRangeChange)}
            />
          </div>
        </div>
        <div className="flex flex-col min-w-[160px]">
          <label className="text-xs text-muted-foreground">Price/unit</label>
          <div className="flex gap-1">
            <input
              type="number"
              placeholder="Min"
              className="w-14 border px-1 py-0.5 rounded"
              value={priceRange[0] === 0 ? "" : priceRange[0]}
              onChange={e => handleRangeChange(0, e.target.value, priceRange, onPriceRangeChange)}
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              className="w-14 border px-1 py-0.5 rounded"
              value={priceRange[1] === 0 ? "" : priceRange[1]}
              onChange={e => handleRangeChange(1, e.target.value, priceRange, onPriceRangeChange)}
            />
          </div>
        </div>
        <div className="flex flex-col min-w-[160px]">
          <label className="text-xs text-muted-foreground">Total Sales</label>
          <div className="flex gap-1">
            <input
              type="number"
              placeholder="Min"
              className="w-14 border px-1 py-0.5 rounded"
              value={totalSalesRange[0] === 0 ? "" : totalSalesRange[0]}
              onChange={e => handleRangeChange(0, e.target.value, totalSalesRange, onTotalSalesRangeChange)}
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              className="w-14 border px-1 py-0.5 rounded"
              value={totalSalesRange[1] === 0 ? "" : totalSalesRange[1]}
              onChange={e => handleRangeChange(1, e.target.value, totalSalesRange, onTotalSalesRangeChange)}
            />
          </div>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>New Sale</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <SalesForm onSubmit={handleSubmit} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

import { useState, useMemo } from "react";
import { UnifiedDataTable } from "./UnifiedDataTable";
import { useQuery } from "@tanstack/react-query";
import { fetchFuelSupplies } from "@/services/fuel-supplies";
import { fetchSales } from "@/services/sales";
import { fetchExpenses } from "@/services/expenses";
import { fetchPetrolProviders } from "@/services/petrol-providers";
import { fetchFillingSystems } from "@/services/filling-systems";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { FuelSuppliesSummary } from "../fuel-supplies/summary/FuelSuppliesSummary";
import { FuelSupply, Sale, Expense } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

// This would typically be in a types file
interface FiltersShape {
  // Common filters
  search: string;
  date?: Date;
  dateRange?: [Date | undefined, Date | undefined];
  
  // Fuel Supplies specific filters
  provider: string;
  tankId?: string;
  fuelType?: string;
  
  // Sales specific filters
  systemId?: string;
  salesFuelType?: string;
  employeeId?: string;
  
  // Expenses specific filters
  expenseCategory?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  
  // Range filters (could be used by different tabs)
  quantityRange: [number, number];
  priceRange: [number, number];
  totalRange: [number, number];
}

export function UnifiedDataManager() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"fuel-supplies" | "sales" | "expenses">("fuel-supplies");

  // State for filters - shared between tabs
  const [filters, setFilters] = useState<FiltersShape>({
    search: "",
    date: undefined,
    dateRange: [undefined, undefined],
    provider: "all",
    tankId: undefined,
    fuelType: undefined,
    systemId: "all",
    salesFuelType: undefined,
    employeeId: undefined,
    expenseCategory: undefined,
    paymentMethod: undefined,
    paymentStatus: undefined,
    quantityRange: [0, 0],
    priceRange: [0, 0],
    totalRange: [0, 0],
  });

  // Fetch fuel supplies data
  const { data: supplies = [], isLoading: suppliesLoading } = useQuery({
    queryKey: ['fuel-supplies'],
    queryFn: fetchFuelSupplies
  });

  // Fetch sales data
  const { data: sales = [], isLoading: salesLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: fetchSales
  });

  // Fetch expenses data
  const { data: expenses = [], isLoading: expensesLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: fetchExpenses
  });

  // Query provider data
  const { data: providersData = [], isLoading: providersLoading } = useQuery({
    queryKey: ["petrol-providers"],
    queryFn: async () => {
      const data = await fetchPetrolProviders();
      if (!data || !Array.isArray(data)) return [];
      
      return data.map(provider => ({
        id: provider.id || '',
        name: provider.name || `Provider ${provider.id?.slice(0, 4) || 'Unknown'}`
      }));
    }
  });

  // Query filling systems data
  const { data: systemsData = [], isLoading: systemsLoading } = useQuery({
    queryKey: ["filling-systems"],
    queryFn: async () => {
      try {
        const data = await fetchFillingSystems();
        if (!data || !Array.isArray(data)) return [];
        
        return data.map(sys => ({
          id: sys.id || '',
          name: sys.name || `System ${sys.id?.slice(0, 4) || 'Unknown'}`
        }));
      } catch (error) {
        console.error("Error fetching filling systems:", error);
        return [];
      }
    }
  });

  // Sample categories data for fuel types
  const categories = [
    { id: "diesel", name: "Diesel" },
    { id: "petrol", name: "Petrol" },
    { id: "gas", name: "Gas" },
    { id: "kerosene", name: "Kerosene" },
    { id: "cng", name: "CNG" },
  ];

  // Expense categories data
  const expenseCategories = [
    { id: "utilities", name: "Utilities" },
    { id: "rent", name: "Rent" },
    { id: "salaries", name: "Salaries" },
    { id: "maintenance", name: "Maintenance" },
    { id: "supplies", name: "Supplies" },
    { id: "taxes", name: "Taxes" },
    { id: "insurance", name: "Insurance" },
    { id: "other", name: "Other" },
  ];

  // Filter fuel supplies data based on filters
  const filteredSupplies = useMemo(() => {
    let filtered = supplies;
    
    if (filters.search) {
      const lower = filters.search.toLowerCase();
      filtered = filtered.filter((supply) =>
        supply.provider?.name?.toLowerCase().includes(lower) ||
        supply.tank?.name?.toLowerCase().includes(lower) ||
        supply.employee?.name?.toLowerCase().includes(lower) ||
        supply.delivery_date?.toString().includes(lower)
      );
    }

    if (filters.date) {
      const filterDate = format(filters.date, 'yyyy-MM-dd');
      filtered = filtered.filter(supply => {
        const supplyDate = supply.delivery_date?.slice(0, 10);
        return supplyDate === filterDate;
      });
    }

    if (filters.provider && filters.provider !== "all") {
      filtered = filtered.filter(supply => supply.provider_id === filters.provider);
    }

    const [qtyMin, qtyMax] = filters.quantityRange;
    if (qtyMin > 0 || qtyMax > 0) {
      filtered = filtered.filter(supply => {
        const q = supply.quantity_liters;
        return (qtyMin === 0 || q >= qtyMin) && (qtyMax === 0 || q <= qtyMax);
      });
    }

    const [priceMin, priceMax] = filters.priceRange;
    if (priceMin > 0 || priceMax > 0) {
      filtered = filtered.filter(supply => {
        const p = supply.price_per_liter;
        return (priceMin === 0 || p >= priceMin) && (priceMax === 0 || p <= priceMax);
      });
    }

    const [costMin, costMax] = filters.totalRange;
    if (costMin > 0 || costMax > 0) {
      filtered = filtered.filter(supply => {
        const c = supply.total_cost;
        return (costMin === 0 || c >= costMin) && (costMax === 0 || c <= costMax);
      });
    }

    return filtered;
  }, [supplies, filters]);

  // Filter sales data based on filters
  const filteredSales = useMemo(() => {
    let filtered = sales;
    
    if (filters.search) {
      const lower = filters.search.toLowerCase();
      filtered = filtered.filter((sale) =>
        sale.filling_system_name?.toLowerCase().includes(lower) ||
        sale.fuel_type?.toLowerCase().includes(lower) ||
        sale.date?.toString().includes(lower)
      );
    }

    if (filters.date) {
      const filterDate = format(filters.date, 'yyyy-MM-dd');
      filtered = filtered.filter(sale => {
        const saleDate = sale.date?.slice(0, 10);
        return saleDate === filterDate;
      });
    }

    if (filters.systemId && filters.systemId !== "all") {
      filtered = filtered.filter(sale => sale.filling_system_id === filters.systemId);
    }

    if (filters.salesFuelType && filters.salesFuelType !== "all") {
      filtered = filtered.filter(sale => sale.fuel_type === filters.salesFuelType);
    }

    const [litMin, litMax] = filters.quantityRange;
    if (litMin > 0 || litMax > 0) {
      filtered = filtered.filter(sale => {
        const q = sale.quantity;
        return (litMin === 0 || q >= litMin) && (litMax === 0 || q <= litMax);
      });
    }

    const [priceMin, priceMax] = filters.priceRange;
    if (priceMin > 0 || priceMax > 0) {
      filtered = filtered.filter(sale => {
        const p = sale.price_per_unit;
        return (priceMin === 0 || p >= priceMin) && (priceMax === 0 || p <= priceMax);
      });
    }

    const [tsMin, tsMax] = filters.totalRange;
    if (tsMin > 0 || tsMax > 0) {
      filtered = filtered.filter(sale => {
        const t = sale.total_sales;
        return (tsMin === 0 || t >= tsMin) && (tsMax === 0 || t <= tsMax);
      });
    }

    return filtered;
  }, [sales, filters]);

  // Filter expenses data based on filters
  const filteredExpenses = useMemo(() => {
    let filtered = expenses;
    
    if (filters.search) {
      const lower = filters.search.toLowerCase();
      filtered = filtered.filter((expense) =>
        expense.description?.toLowerCase().includes(lower) ||
        expense.category?.toLowerCase().includes(lower) ||
        expense.date?.toString().includes(lower)
      );
    }

    if (filters.date) {
      const filterDate = format(filters.date, 'yyyy-MM-dd');
      filtered = filtered.filter(expense => {
        const expenseDate = expense.date?.slice(0, 10);
        return expenseDate === filterDate;
      });
    }

    if (filters.expenseCategory && filters.expenseCategory !== "all") {
      filtered = filtered.filter(expense => expense.category === filters.expenseCategory);
    }

    const [amountMin, amountMax] = filters.totalRange;
    if (amountMin > 0 || amountMax > 0) {
      filtered = filtered.filter(expense => {
        const amount = expense.amount;
        return (amountMin === 0 || amount >= amountMin) && (amountMax === 0 || amount <= amountMax);
      });
    }

    return filtered;
  }, [expenses, filters]);

  // Define columns for fuel supplies
  const suppliesColumns: ColumnDef<FuelSupply>[] = [
    {
      id: "delivery_date",
      header: () => <div className="text-left font-medium">{t("fuelSupplies.deliveryDate")}</div>,
      accessorKey: "delivery_date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("delivery_date"));
        return (
          <div className="font-medium">
            {isNaN(date.getTime()) ? "N/A" : format(date, "PP")}
          </div>
        );
      },
    },
    {
      id: "provider",
      header: () => <div className="text-left font-medium">{t("fuelSupplies.provider")}</div>,
      accessorKey: "provider.name",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.provider?.name || "N/A"}</div>
      ),
    },
    {
      id: "tank",
      header: () => <div className="text-left font-medium">{t("fuelSupplies.tank")}</div>,
      accessorKey: "tank.name",
      cell: ({ row }) => {
        const tank = row.original.tank;
        return (
          <div>
            <div className="font-medium">{tank?.name || "N/A"}</div>
            <Badge variant="outline" className="mt-1 text-xs">
              {tank?.fuel_type || "N/A"}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "quantity_liters",
      header: () => <div className="text-right font-medium">{t("fuelSupplies.quantity")}</div>,
      accessorKey: "quantity_liters",
      cell: ({ row }) => {
        const value = Number(row.getValue("quantity_liters") || 0).toFixed(2);
        return (
          <div className="text-right font-medium tabular-nums">
            <span className="rounded-md bg-primary/10 px-2 py-1 text-primary">
              {value} L
            </span>
          </div>
        );
      },
    },
    {
      id: "price_per_liter",
      header: () => <div className="text-right font-medium">{t("fuelSupplies.pricePerLiter")}</div>,
      accessorKey: "price_per_liter",
      cell: ({ row }) => {
        const value = Number(row.getValue("price_per_liter") || 0).toLocaleString();
        return (
          <div className="text-right font-medium tabular-nums">
            {value} ֏
          </div>
        );
      },
    },
    {
      id: "total_cost",
      header: () => <div className="text-right font-medium">{t("fuelSupplies.totalCost")}</div>,
      accessorKey: "total_cost",
      cell: ({ row }) => {
        const value = Number(row.getValue("total_cost") || 0).toLocaleString();
        return (
          <div className="text-right font-medium tabular-nums">
            <span className="font-semibold text-primary">{value} ֏</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const supply = row.original;
        return (
          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditSupply(supply)}
              className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
            >
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteSupply(supply)}
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        );
      },
    },
  ];

  // Define columns for sales
  const salesColumns: ColumnDef<Sale>[] = [
    {
      id: "date",
      header: () => <div className="text-left font-medium">{t("common.date")}</div>,
      accessorKey: "date",
      cell: ({ row }) => {
        const saleDate = row.getValue("date") as string;
        return <div className="font-medium">{format(new Date(saleDate), "PP")}</div>;
      },
    },
    {
      id: "filling_system_name",
      header: () => <div className="text-left font-medium">{t("sales.fillingSystem")}</div>,
      accessorKey: "filling_system_name",
      cell: ({ row }) => {
        const system = row.getValue("filling_system_name") as string;
        const fuelType = row.original.fuel_type;
        return (
          <div className="flex flex-col">
            <div className="font-medium">{system}</div>
            <Badge variant="outline" className="mt-1 w-fit">
              {fuelType}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "quantity",
      header: () => <div className="text-right font-medium">{t("common.quantity")}</div>,
      accessorKey: "quantity",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("quantity") as string);
        return (
          <div className="text-right font-medium tabular-nums">
            <span className="rounded-md bg-primary/10 px-2 py-1 text-primary">
              {amount.toFixed(2)} L
            </span>
          </div>
        );
      },
    },
    {
      id: "price_per_unit",
      header: () => <div className="text-right font-medium">{t("sales.unitPrice")}</div>,
      accessorKey: "price_per_unit",
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price_per_unit") as string);
        return <div className="text-right font-medium tabular-nums">{price.toLocaleString()} ֏</div>;
      },
    },
    {
      id: "total_sales",
      header: () => <div className="text-right font-medium">{t("sales.totalSales")}</div>,
      accessorKey: "total_sales",
      cell: ({ row }) => {
        const totalSales = parseFloat(row.getValue("total_sales") as string);
        return (
          <div className="text-right font-medium tabular-nums">
            <span className="font-semibold text-primary">{totalSales.toLocaleString()} ֏</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const sale = row.original;
        return (
          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleViewSale(sale)}
              className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">View</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditSale(sale)}
              className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
            >
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteSale(sale)}
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        );
      },
    },
  ];

  // Define columns for expenses
  const expensesColumns: ColumnDef<Expense>[] = [
    {
      id: "date",
      header: () => <div className="text-left font-medium">{t("expenses.expenseDate")}</div>,
      accessorKey: "date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("date"));
        return (
          <div className="font-medium">
            {isNaN(date.getTime()) ? "N/A" : format(date, "PP")}
          </div>
        );
      },
    },
    {
      id: "category",
      header: () => <div className="text-left font-medium">{t("expenses.expenseCategory")}</div>,
      accessorKey: "category",
      cell: ({ row }) => {
        const category = row.getValue("category") as string;
        return (
          <div className="font-medium capitalize">
            <Badge variant="outline" className="capitalize">
              {category || "N/A"}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "description",
      header: () => <div className="text-left font-medium">{t("expenses.expenseDetails")}</div>,
      accessorKey: "description",
      cell: ({ row }) => {
        return (
          <div className="font-medium">
            {row.getValue("description") || "N/A"}
          </div>
        );
      },
    },
    {
      id: "amount",
      header: () => <div className="text-right font-medium">{t("expenses.amount")}</div>,
      accessorKey: "amount",
      cell: ({ row }) => {
        const value = Number(row.getValue("amount") || 0).toLocaleString();
        return (
          <div className="text-right font-medium tabular-nums">
            <span className="font-semibold text-primary">{value} ֏</span>
          </div>
        );
      },
    },
    {
      id: "payment_method",
      header: () => <div className="text-left font-medium">{t("expenses.paymentMethod")}</div>,
      accessorKey: "payment_method",
      cell: ({ row }) => {
        return (
          <div className="font-medium capitalize">
            {row.getValue("payment_method") || "N/A"}
          </div>
        );
      },
    },
    {
      id: "payment_status",
      header: () => <div className="text-left font-medium">Status</div>,
      accessorKey: "payment_status",
      cell: ({ row }) => {
        const status = row.getValue("payment_status") as string;
        return (
          <div className="font-medium">
            <Badge className={
              status === 'paid' 
                ? 'bg-green-100 text-green-800' 
                : status === 'pending' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-red-100 text-red-800'
            }>
              {status || "N/A"}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right font-medium">{t("common.actions")}</div>,
      cell: ({ row }) => {
        const expense = row.original;
        return (
          <div className="text-right space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditExpense(expense)}
              className="h-8 w-8"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteExpense(expense)}
              className="h-8 w-8 text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  // Handlers for fuel supplies
  const handleEditSupply = (item: FuelSupply) => {
    console.log("Edit fuel supply:", item);
    toast({
      title: "Edit Fuel Supply",
      description: `Editing supply from ${item.provider?.name} (${format(new Date(item.delivery_date), "PP")})`,
    });
  };

  const handleDeleteSupply = (item: FuelSupply) => {
    console.log("Delete fuel supply:", item);
    toast({
      title: "Delete Fuel Supply",
      description: `Are you sure you want to delete this supply record?`,
      variant: "destructive",
    });
  };

  // Handlers for sales
  const handleViewSale = (item: Sale) => {
    console.log("View sale:", item);
    toast({
      title: `Sale Details: ${item.filling_system_name}`,
      description: (
        <div className="mt-2 text-sm">
          <p>Date: {new Date(item.date).toLocaleDateString()}</p>
          <p>Fuel Type: {item.fuel_type}</p>
          <p>Quantity: {item.quantity.toFixed(2)} L</p>
          <p>Price: {item.price_per_unit.toLocaleString()} ֏</p>
          <p>Total: {item.total_sales.toLocaleString()} ֏</p>
        </div>
      ),
    });
  };

  const handleEditSale = (item: Sale) => {
    console.log("Edit sale:", item);
    toast({
      title: "Edit Sale",
      description: `Editing sale from ${item.filling_system_name} (${format(new Date(item.date), "PP")})`,
    });
  };

  const handleDeleteSale = (item: Sale) => {
    console.log("Delete sale:", item);
    toast({
      title: "Delete Sale",
      description: `Are you sure you want to delete this sale record?`,
      variant: "destructive",
    });
  };

  // Handlers for expenses
  const handleEditExpense = (item: Expense) => {
    console.log("Edit expense:", item);
    toast({
      title: "Edit Expense",
      description: `Editing expense: ${item.description} (${format(new Date(item.date), "PP")})`,
    });
  };

  const handleDeleteExpense = (item: Expense) => {
    console.log("Delete expense:", item);
    toast({
      title: "Delete Expense",
      description: `Are you sure you want to delete this expense record?`,
      variant: "destructive",
    });
  };

  const handleFiltersChange = (updates: Partial<FiltersShape>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  const handleAdd = () => {
    let entityType = "fuel supply";
    if (activeTab === "sales") entityType = "sale";
    if (activeTab === "expenses") entityType = "expense";
    
    console.log(`Add new ${entityType}`);
    toast({
      title: `Add New ${activeTab === "fuel-supplies" ? "Fuel Supply" : activeTab === "sales" ? "Sale" : "Expense"}`,
      description: "Opening form to add a new record",
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as "fuel-supplies" | "sales" | "expenses");
  };

  // Create fuel supplies summary component
  const FuelSuppliesSummaryComponent = useMemo(() => (
    <FuelSuppliesSummary supplies={filteredSupplies} />
  ), [filteredSupplies]);

  // Create sales summary component
  const SalesSummaryComponent = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm font-medium text-muted-foreground mb-2">Total Sales</div>
          <div className="text-2xl font-bold">
            {filteredSales.reduce((sum, sale) => sum + sale.total_sales, 0).toLocaleString()} ֏
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {filteredSales.length} sale records
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm font-medium text-muted-foreground mb-2">Total Volume</div>
          <div className="text-2xl font-bold">
            {filteredSales.reduce((sum, sale) => sum + sale.quantity, 0).toFixed(2)} L
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Average: {(filteredSales.reduce((sum, sale) => sum + sale.quantity, 0) / (filteredSales.length || 1)).toFixed(2)} L per sale
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm font-medium text-muted-foreground mb-2">Avg. Price/Unit</div>
          <div className="text-2xl font-bold">
            {filteredSales.length > 0 
              ? (filteredSales.reduce((sum, sale) => sum + sale.total_sales, 0) / 
                 filteredSales.reduce((sum, sale) => sum + sale.quantity, 0)).toLocaleString(undefined, { maximumFractionDigits: 0 })
              : "0"} ֏
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Based on {filteredSales.length} sales
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm font-medium text-muted-foreground mb-2">Sales by Fuel Type</div>
          <div className="flex flex-col space-y-2">
            {Object.entries(filteredSales.reduce((acc, sale) => {
              const fuelType = sale.fuel_type || 'Unknown';
              acc[fuelType] = (acc[fuelType] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)).map(([fuelType, count]) => (
              <div key={fuelType} className="flex justify-between items-center">
                <span className="text-sm capitalize">{fuelType}</span>
                <span className="text-sm font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  ), [filteredSales]);

  // Create expenses summary component
  const ExpensesSummaryComponent = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm font-medium text-muted-foreground mb-2">Total Expenses</div>
          <div className="text-2xl font-bold">
            {filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString()} ֏
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {filteredExpenses.length} expense records
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm font-medium text-muted-foreground mb-2">Avg. Expense</div>
          <div className="text-2xl font-bold">
            {filteredExpenses.length > 0 
              ? (filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0) / filteredExpenses.length).toLocaleString(undefined, { maximumFractionDigits: 0 })
              : "0"} ֏
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Per expense item
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm font-medium text-muted-foreground mb-2">Payment Methods</div>
          <div className="flex flex-col space-y-2">
            {Object.entries(filteredExpenses.reduce((acc, expense) => {
              const method = expense.payment_method || 'Unknown';
              acc[method] = (acc[method] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)).map(([method, count]) => (
              <div key={method} className="flex justify-between items-center">
                <span className="text-sm capitalize">{method}</span>
                <span className="text-sm font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm font-medium text-muted-foreground mb-2">Top Categories</div>
          <div className="flex flex-col space-y-2">
            {Object.entries(filteredExpenses.reduce((acc, expense) => {
              const category = expense.category || 'Other';
              acc[category] = (acc[category] || 0) + expense.amount;
              return acc;
            }, {} as Record<string, number>))
              .sort((a, b) => b[1] - a[1])
              .slice(0, 4)
              .map(([category, amount]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-sm capitalize">{category}</span>
                  <span className="text-sm font-semibold">{(amount).toLocaleString()}</span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  ), [filteredExpenses]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {t(`unifiedData.${activeTab === "fuel-supplies" 
            ? "fuelSuppliesTab" 
            : activeTab === "sales" 
              ? "salesTab" 
              : "expensesTab"}`)}
        </h1>
        <Button onClick={handleAdd} className="gap-2 shadow-sm">
          <Plus className="h-4 w-4" />
          <span>{t("unifiedData.addNew")}</span>
        </Button>
      </div>

      <Tabs 
        defaultValue="fuel-supplies" 
        value={activeTab}
        onValueChange={handleTabChange} 
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="fuel-supplies">{t("unifiedData.fuelSuppliesTab")}</TabsTrigger>
          <TabsTrigger value="sales">{t("unifiedData.salesTab")}</TabsTrigger>
          <TabsTrigger value="expenses">{t("unifiedData.expensesTab")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="fuel-supplies">
          <UnifiedDataTable
            title={t("unifiedData.fuelSuppliesTab")}
            columns={suppliesColumns}
            data={filteredSupplies}
            isLoading={suppliesLoading || providersLoading}
            onEdit={handleEditSupply}
            onDelete={handleDeleteSupply}
            providers={providersData}
            categories={categories}
            onFiltersChange={handleFiltersChange}
            filters={filters}
            searchColumn="provider.name"
            searchPlaceholder={t("unifiedData.searchPlaceholder")}
            summaryComponent={FuelSuppliesSummaryComponent}
          />
        </TabsContent>
        
        <TabsContent value="sales">
          <UnifiedDataTable
            title={t("unifiedData.salesTab")}
            columns={salesColumns}
            data={filteredSales}
            isLoading={salesLoading || systemsLoading}
            onEdit={handleEditSale}
            onDelete={handleDeleteSale}
            providers={[]}
            categories={categories}
            systems={systemsData}
            onFiltersChange={handleFiltersChange}
            filters={filters}
            searchColumn="filling_system_name"
            searchPlaceholder={t("unifiedData.searchPlaceholder")}
            summaryComponent={SalesSummaryComponent}
          />
        </TabsContent>
        
        <TabsContent value="expenses">
          <UnifiedDataTable
            title={t("unifiedData.expensesTab")}
            columns={expensesColumns}
            data={filteredExpenses}
            isLoading={expensesLoading}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
            providers={providersData}
            categories={expenseCategories}
            onFiltersChange={handleFiltersChange}
            filters={filters}
            searchColumn="description"
            searchPlaceholder={t("unifiedData.searchPlaceholder")}
            summaryComponent={ExpensesSummaryComponent}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 
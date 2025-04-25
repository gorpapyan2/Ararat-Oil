import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { 
  ChevronDown, 
  Filter, 
  Trash2, 
  Pencil, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal,
  Calendar,
  UserCircle2,
  Fuel,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FuelSupply } from "@/types";
import { format } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface DataTableProps {
  data: FuelSupply[];
  isLoading: boolean;
  onEdit: (supply: FuelSupply) => void;
  onDelete: (supply: FuelSupply) => void;
}

export function FuelSuppliesDataTable({ data, isLoading, onEdit, onDelete }: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "delivery_date", desc: true }
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    "comments": false,
  });
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedSupplyForMobile, setSelectedSupplyForMobile] = React.useState<FuelSupply | null>(null);

  const columns: ColumnDef<FuelSupply>[] = [
    {
      accessorKey: "delivery_date",
      header: "Delivery Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("delivery_date"));
        return format(date, "PP");
      },
      sortingFn: "datetime",
    },
    {
      accessorKey: "provider.name",
      header: "Provider",
      cell: ({ row }) => row.original.provider?.name || "N/A",
    },
    {
      accessorKey: "tank.name",
      header: "Tank",
      cell: ({ row }) => {
        const tank = row.original.tank;
        return (
          <div className="flex flex-col">
            <span>{tank?.name || "N/A"}</span>
            <Badge variant="outline" className="mt-1 text-xs w-fit">
              {tank?.fuel_type || "N/A"}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "quantity_liters",
      header: "Quantity (L)",
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {Number(row.getValue("quantity_liters")).toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "price_per_liter",
      header: "Price (֏)",
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {Number(row.getValue("price_per_liter")).toLocaleString()} ֏
        </div>
      ),
    },
    {
      accessorKey: "total_cost",
      header: "Total Cost (֏)",
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {Number(row.getValue("total_cost")).toLocaleString()} ֏
        </div>
      ),
    },
    {
      accessorKey: "employee.name",
      header: "Employee",
      cell: ({ row }) => row.original.employee?.name || "N/A",
    },
    {
      accessorKey: "comments",
      header: "Comments",
      cell: ({ row }) => row.original.comments || "N/A",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const supply = row.original;
        return (
          <div className="flex items-center justify-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(supply);
                    }}
                  >
                    <Pencil className="h-4 w-4 text-blue-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit supply</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(supply);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete supply</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <div className="hidden md:block">
          {/* Desktop skeleton */}
          <div className="rounded-md border">
            <div className="border-b px-4 py-3 bg-card">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full mt-2" />
              ))}
            </div>
            <div className="p-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full mt-2" />
              ))}
            </div>
          </div>
        </div>
        
        <div className="md:hidden space-y-3">
          {/* Mobile skeleton */}
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="w-full">
              <CardContent className="p-0">
                <div className="p-4 space-y-3">
                  {[...Array(4)].map((_, j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center space-y-2">
        <p className="text-lg font-medium text-muted-foreground">No fuel supply records found</p>
        <p className="text-sm text-muted-foreground">Add a new record to get started</p>
      </div>
    );
  }

  // Mobile view - Card based layout
  const MobileView = () => (
    <div className="space-y-4 md:hidden">
      {table.getRowModel().rows.map((row) => {
        const supply = row.original;
        const tank = supply.tank;
        return (
          <Card key={row.id} className="w-full">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-y-3">
                <div className="space-y-1">
                  <div className="flex items-center text-muted-foreground text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    Date
                  </div>
                  <p className="font-medium text-sm">
                    {format(new Date(supply.delivery_date), "PP")}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center text-muted-foreground text-xs">
                    <Fuel className="h-3 w-3 mr-1" />
                    Tank
                  </div>
                  <div className="flex flex-col">
                    <p className="font-medium text-sm">{tank?.name || "N/A"}</p>
                    <Badge variant="outline" className="mt-1 text-xs w-fit">
                      {tank?.fuel_type || "N/A"}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center text-muted-foreground text-xs">
                    Provider
                  </div>
                  <p className="font-medium text-sm">
                    {supply.provider?.name || "N/A"}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center text-muted-foreground text-xs">
                    <UserCircle2 className="h-3 w-3 mr-1" />
                    Employee
                  </div>
                  <p className="font-medium text-sm">
                    {supply.employee?.name || "N/A"}
                  </p>
                </div>
                
                <div className="col-span-2 flex justify-between items-center mt-2 pt-2 border-t">
                  <div>
                    <p className="text-muted-foreground text-xs">Total Cost</p>
                    <p className="font-bold text-base">
                      {Number(supply.total_cost).toLocaleString()} ֏
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => onEdit(supply)}
                    >
                      <Pencil className="h-4 w-4 text-blue-500" />
                    </Button>
                    
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => setSelectedSupplyForMobile(supply)}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <div className="mx-auto w-full max-w-sm">
                          <DrawerHeader>
                            <DrawerTitle>Fuel Supply Details</DrawerTitle>
                            <DrawerDescription>
                              Delivery on {format(new Date(supply.delivery_date), "PPP")}
                            </DrawerDescription>
                          </DrawerHeader>
                          
                          <div className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Provider</p>
                                <p className="font-medium">{supply.provider?.name || "N/A"}</p>
                              </div>
                              
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Tank</p>
                                <div>
                                  <p className="font-medium">{tank?.name || "N/A"}</p>
                                  <Badge variant="outline" className="mt-1">
                                    {tank?.fuel_type || "N/A"}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Quantity</p>
                                <p className="font-medium">{Number(supply.quantity_liters).toFixed(2)} L</p>
                              </div>
                              
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Price per Liter</p>
                                <p className="font-medium">{Number(supply.price_per_liter).toLocaleString()} ֏</p>
                              </div>
                              
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Total Cost</p>
                                <p className="font-bold">{Number(supply.total_cost).toLocaleString()} ֏</p>
                              </div>
                              
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Employee</p>
                                <p className="font-medium">{supply.employee?.name || "N/A"}</p>
                              </div>
                            </div>
                            
                            {supply.comments && (
                              <div className="space-y-1 pt-2 border-t">
                                <div className="flex items-center text-muted-foreground text-sm">
                                  <MessageSquare className="h-4 w-4 mr-1" />
                                  Comments
                                </div>
                                <p className="text-sm">{supply.comments}</p>
                              </div>
                            )}
                          </div>
                          
                          <DrawerFooter className="flex-row gap-2">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => onEdit(supply)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              className="flex-1"
                              onClick={() => {
                                onDelete(supply);
                              }}
                            >
                              Delete
                            </Button>
                          </DrawerFooter>
                        </div>
                      </DrawerContent>
                    </Drawer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      <div className="py-2">
        <MobilePagination table={table} />
      </div>
    </div>
  );

  // Desktop view - Table based layout
  const DesktopView = () => (
    <div className="hidden md:block rounded-md border">
      <div className="flex items-center justify-between p-4">
        <div className="flex flex-1 items-center space-x-2">
          <div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 ml-auto"
              onClick={() => {
                // Logic for export to be implemented
                console.log("Export data");
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto h-8">
              <Filter className="mr-2 h-4 w-4" />
              View
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4 px-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing{" "}
          <strong>
            {table.getFilteredRowModel().rows.length 
              ? `${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-${Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}` 
              : 0}
          </strong>{" "}
          of{" "}
          <strong>{table.getFilteredRowModel().rows.length}</strong> supplies
        </div>
        
        <DesktopPagination table={table} />
      </div>
    </div>
  );

  const MobilePagination = ({ table }: { table: any }) => {
    const currentPage = table.getState().pagination.pageIndex + 1;
    const totalPages = table.getPageCount();
    
    return (
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const DesktopPagination = ({ table }: { table: any }) => {
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                table.previousPage();
              }}
              disabled={!table.getCanPreviousPage()}
            />
          </PaginationItem>
          
          {[...Array(Math.min(5, table.getPageCount()))].map((_, i) => {
            const pageIndex = i;
            const isCurrentPage = table.getState().pagination.pageIndex === pageIndex;
            
            return (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    table.setPageIndex(pageIndex);
                  }}
                  isActive={isCurrentPage}
                >
                  {pageIndex + 1}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                table.nextPage();
              }}
              disabled={!table.getCanNextPage()}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="space-y-4">
      <MobileView />
      <DesktopView />
    </div>
  );
}

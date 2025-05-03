import React, { useState, useEffect } from 'react';
import { 
  StandardizedDataTable, 
  createBadgeCell, 
  createDateCell, 
  createCurrencyCell, 
  createNumberCell, 
  createActionsColumn,
  type FiltersShape
} from '@/components/unified/StandardizedDataTable';

// Example data type
interface FuelSupply {
  id: string;
  supplier: string;
  fuelType: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  deliveryDate: string;
  status: string;
}

export function StandardizedDataTableExample() {
  const [data, setData] = useState<FuelSupply[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FiltersShape>({
    searchTerm: '',
    startDate: undefined,
    endDate: undefined,
    status: '',
    supplier: '',
    fuelType: ''
  });
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Simulate API call to fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // In a real application, you would make an API call here
      // Simulating API call with timeout
      setTimeout(() => {
        const mockData: FuelSupply[] = [
          {
            id: '1',
            supplier: 'Petroleum Inc.',
            fuelType: 'Diesel',
            quantity: 5000,
            unitPrice: 350,
            totalPrice: 1750000,
            deliveryDate: '2023-10-15',
            status: 'Delivered'
          },
          {
            id: '2',
            supplier: 'GasCorp',
            fuelType: 'Petrol',
            quantity: 3000,
            unitPrice: 400,
            totalPrice: 1200000,
            deliveryDate: '2023-10-18',
            status: 'Pending'
          },
          {
            id: '3',
            supplier: 'FuelMasters',
            fuelType: 'Diesel',
            quantity: 4500,
            unitPrice: 340,
            totalPrice: 1530000,
            deliveryDate: '2023-10-20',
            status: 'Delivered'
          },
          {
            id: '4',
            supplier: 'Petroleum Inc.',
            fuelType: 'Petrol',
            quantity: 2800,
            unitPrice: 410,
            totalPrice: 1148000,
            deliveryDate: '2023-10-22',
            status: 'Processing'
          },
          {
            id: '5',
            supplier: 'GasCorp',
            fuelType: 'Diesel',
            quantity: 6000,
            unitPrice: 360,
            totalPrice: 2160000,
            deliveryDate: '2023-10-25',
            status: 'Delivered'
          }
        ];
        setData(mockData);
        setTotalRows(50); // Simulating total rows count for pagination
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, [filters, currentPage, pageSize]); // Re-fetch when filters or pagination changes

  // Define columns
  const columns = [
    {
      header: 'Supplier',
      accessorKey: 'supplier' as keyof FuelSupply
    },
    {
      header: 'Fuel Type',
      accessorKey: 'fuelType' as keyof FuelSupply
    },
    {
      header: 'Quantity (L)',
      accessorKey: 'quantity' as keyof FuelSupply,
      cell: (value: number) => createNumberCell(value, 0)
    },
    {
      header: 'Unit Price',
      accessorKey: 'unitPrice' as keyof FuelSupply,
      cell: (value: number) => createCurrencyCell(value)
    },
    {
      header: 'Total Price',
      accessorKey: 'totalPrice' as keyof FuelSupply,
      cell: (value: number) => createCurrencyCell(value)
    },
    {
      header: 'Delivery Date',
      accessorKey: 'deliveryDate' as keyof FuelSupply,
      cell: (value: string) => createDateCell(value)
    },
    {
      header: 'Status',
      accessorKey: 'status' as keyof FuelSupply,
      cell: (value: string) => {
        const variant = value === 'Delivered' 
          ? 'success' 
          : value === 'Pending' 
            ? 'warning' 
            : 'info';
        return createBadgeCell(value, variant);
      }
    },
    createActionsColumn<FuelSupply>(
      (id) => handleEdit(id),
      (id) => handleDelete(id)
    )
  ];

  // Handlers
  const handleFilterChange = (newFilters: FiltersShape) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleEdit = (id: string | number) => {
    console.log(`Editing record with ID: ${id}`);
    // In a real application, you might open a modal or navigate to an edit page
  };

  const handleDelete = (id: string | number) => {
    console.log(`Deleting record with ID: ${id}`);
    // In a real application, you would show a confirmation dialog and then delete
  };

  const handleRowClick = (row: FuelSupply) => {
    console.log('Row clicked:', row);
    // In a real application, you might navigate to a details page
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Fuel Supplies</h1>
      
      <StandardizedDataTable
        title="Fuel Supplies"
        columns={columns}
        data={data}
        loading={loading}
        onRowClick={handleRowClick}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filters={filters}
        onFilterChange={handleFilterChange}
        totalRows={totalRows}
        serverSide={true}
        onPageChange={handlePageChange}
        exportOptions={{
          enabled: true,
          filename: 'fuel-supplies-export'
        }}
        className="bg-white rounded-lg shadow"
      />
    </div>
  );
} 
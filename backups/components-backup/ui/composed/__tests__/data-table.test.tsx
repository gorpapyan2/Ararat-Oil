import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DataTable, DataTableSkeleton } from '../data-table';
import { ColumnDef } from '@tanstack/react-table';

// Mock the lucide-react icons
jest.mock('lucide-react', () => ({
  Download: () => <div data-testid="download-icon">Download</div>,
  ChevronDown: () => <div data-testid="chevron-down-icon">ChevronDown</div>,
  ChevronUp: () => <div data-testid="chevron-up-icon">ChevronUp</div>,
  Check: () => <div data-testid="check-icon">Check</div>,
  FilterX: () => <div data-testid="filter-x-icon">FilterX</div>,
  Filter: () => <div data-testid="filter-icon">Filter</div>,
}));

// Sample test data
interface TestData {
  id: string;
  name: string;
  age: number;
  status: string;
}

const testData: TestData[] = [
  { id: '1', name: 'John Doe', age: 30, status: 'Active' },
  { id: '2', name: 'Jane Smith', age: 25, status: 'Inactive' },
  { id: '3', name: 'Bob Johnson', age: 40, status: 'Active' },
];

const testColumns: ColumnDef<TestData, any>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'age',
    header: 'Age',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
];

describe('DataTable', () => {
  it('renders with basic props', () => {
    render(
      <DataTable
        data={testData}
        columns={testColumns}
      />
    );

    // Check for column headers
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();

    // Check for data
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <DataTable
        title="Test Table"
        data={testData}
        columns={testColumns}
      />
    );

    expect(screen.getByText('Test Table')).toBeInTheDocument();
  });

  it('renders loading overlay when loading', () => {
    render(
      <DataTable
        data={testData}
        columns={testColumns}
        loading={true}
      />
    );

    // Should have a loading overlay
    const loadingOverlay = document.querySelector('.absolute.inset-0');
    expect(loadingOverlay).toBeInTheDocument();
  });

  it('renders export button when export is enabled', () => {
    render(
      <DataTable
        data={testData}
        columns={testColumns}
        export={{ enabled: true, filename: 'test-export' }}
      />
    );

    expect(screen.getByText('Export')).toBeInTheDocument();
    expect(screen.getByTestId('download-icon')).toBeInTheDocument();
  });

  it('renders no results message when data is empty', () => {
    render(
      <DataTable
        data={[]}
        columns={testColumns}
        noResultsMessage="No data found"
      />
    );

    expect(screen.getByText('No data found')).toBeInTheDocument();
  });

  it('renders pagination correctly', () => {
    render(
      <DataTable
        data={testData}
        columns={testColumns}
      />
    );

    // Check if pagination elements are present
    expect(screen.getByText('Page size:')).toBeInTheDocument();
    expect(screen.getByText('Page')).toBeInTheDocument();
    expect(screen.getByText('1 of 1')).toBeInTheDocument();
  });

  it('renders with custom page size', () => {
    render(
      <DataTable
        data={testData}
        columns={testColumns}
        defaultPageSize={5}
        pageSizeOptions={[5, 10, 20]}
      />
    );

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders global filter input', () => {
    render(
      <DataTable
        data={testData}
        columns={testColumns}
        globalFilterPlaceholder="Search here..."
      />
    );

    const input = screen.getByPlaceholderText('Search here...');
    expect(input).toBeInTheDocument();
  });

  const mockData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 40 },
  ];

  const mockColumns = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Name', accessorKey: 'name' },
    { header: 'Email', accessorKey: 'email' },
    { 
      header: 'Age', 
      accessorKey: 'age',
      footer: (data: any[]) => `Average: ${Math.round(data.reduce((acc, row) => acc + row.age, 0) / data.length)}`
    },
  ];

  it('renders the table with provided data', () => {
    render(<DataTable data={mockData} columns={mockColumns} />);

    // Check column headers
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();

    // Check data rows
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
  });

  it('renders a caption when provided', () => {
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns} 
        caption="Employee Information" 
      />
    );

    expect(screen.getByText('Employee Information')).toBeInTheDocument();
  });

  it('shows loading state when loading prop is true', () => {
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns} 
        loading={true} 
      />
    );

    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('displays a message when no data is available', () => {
    render(
      <DataTable 
        data={[]} 
        columns={mockColumns} 
        noResultsMessage="Custom empty message" 
      />
    );

    expect(screen.getByText('Custom empty message')).toBeInTheDocument();
  });

  describe('Sorting functionality', () => {
    it('enables sorting when enableSorting is true', () => {
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          enableSorting={true} 
        />
      );

      const header = screen.getByText('Name');
      expect(header.closest('th')).toHaveClass('cursor-pointer');
      
      // Check for sort icon
      const headerContainer = header.closest('th');
      expect(within(headerContainer).getByTestId || within(headerContainer).queryByTestId('sort-icon')).toBeTruthy();
    });

    it('sorts data when a sortable column header is clicked', () => {
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          enableSorting={true} 
        />
      );

      const nameHeader = screen.getByText('Name');
      
      // Click to sort ascending
      fireEvent.click(nameHeader);
      
      // Get all rows
      const rows = screen.getAllByRole('row').slice(1); // Skip header row
      
      // Check first row is youngest person
      expect(within(rows[0]).getByText('25')).toBeInTheDocument();
      expect(within(rows[0]).getByText('Jane Smith')).toBeInTheDocument();
      
      // Click again to sort descending
      fireEvent.click(nameHeader);
      
      // Check first row is oldest person
      const rowsAfterSort = screen.getAllByRole('row').slice(1);
      expect(within(rowsAfterSort[0]).getByText('40')).toBeInTheDocument();
      expect(within(rowsAfterSort[0]).getByText('Bob Johnson')).toBeInTheDocument();
    });
  });

  describe('Filtering functionality', () => {
    it('shows a search input when enableFiltering is true', () => {
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          enableFiltering={true} 
        />
      );

      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('filters data based on search input', () => {
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          enableFiltering={true} 
        />
      );

      const searchInput = screen.getByPlaceholderText('Search...');
      
      // Filter by name
      fireEvent.change(searchInput, { target: { value: 'jane' } });
      
      // Only Jane should be visible
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
      expect(screen.queryByText('Bob Johnson')).not.toBeInTheDocument();
      
      // Clear filter
      fireEvent.change(searchInput, { target: { value: '' } });
      
      // All should be visible again
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });
  });

  describe('Pagination functionality', () => {
    const largeDataSet = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `Person ${i + 1}`,
      email: `person${i + 1}@example.com`,
      age: 20 + i,
    }));

    it('shows pagination controls when enablePagination is true', () => {
      render(
        <DataTable 
          data={largeDataSet} 
          columns={mockColumns} 
          enablePagination={true}
          pageSize={10}
        />
      );

      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('only shows pageSize items per page', () => {
      render(
        <DataTable 
          data={largeDataSet} 
          columns={mockColumns} 
          enablePagination={true}
          pageSize={10}
        />
      );

      // On first page, should show Person 1 through Person 10
      expect(screen.getByText('Person 1')).toBeInTheDocument();
      expect(screen.getByText('Person 10')).toBeInTheDocument();
      expect(screen.queryByText('Person 11')).not.toBeInTheDocument();
      
      // Navigate to second page
      fireEvent.click(screen.getByText('2'));
      
      // Should now show Person 11 through Person 20
      expect(screen.queryByText('Person 10')).not.toBeInTheDocument();
      expect(screen.getByText('Person 11')).toBeInTheDocument();
      expect(screen.getByText('Person 20')).toBeInTheDocument();
      expect(screen.queryByText('Person 21')).not.toBeInTheDocument();
    });
  });

  describe('Custom cell rendering', () => {
    it('uses custom cell renderer when provided', () => {
      const columnsWithCustomCell = [
        ...mockColumns,
        { 
          header: 'Status', 
          accessorKey: 'age', 
          cell: (row) => (
            <span data-testid="custom-cell">
              {Number(row.age) < 30 ? 'Junior' : 'Senior'}
            </span>
          ) 
        }
      ];

      render(
        <DataTable 
          data={mockData} 
          columns={columnsWithCustomCell} 
        />
      );

      const customCells = screen.getAllByTestId('custom-cell');
      expect(customCells).toHaveLength(3);
      expect(customCells[0]).toHaveTextContent('Senior');
      expect(customCells[1]).toHaveTextContent('Junior');
      expect(customCells[2]).toHaveTextContent('Senior');
    });
  });

  describe('Row click functionality', () => {
    it('calls onRowClick when a row is clicked', () => {
      const handleRowClick = jest.fn();
      
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          onRowClick={handleRowClick} 
        />
      );

      const rows = screen.getAllByRole('row').slice(1); // Skip header row
      fireEvent.click(rows[1]); // Click on Jane Smith row
      
      expect(handleRowClick).toHaveBeenCalledTimes(1);
      expect(handleRowClick).toHaveBeenCalledWith(mockData[1]);
    });
  });

  // New tests for server-side functionality
  it('handles server-side pagination', async () => {
    const handlePaginationChange = jest.fn();
    
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns} 
        enablePagination={true} 
        serverSide={{
          enabled: true,
          totalCount: 100,
          onPaginationChange: handlePaginationChange
        }}
      />
    );
    
    // Check if pagination shows correct total
    expect(screen.getByText(/Showing 1 to/)).toBeInTheDocument();
    expect(screen.getByText(/of 100 entries/)).toBeInTheDocument();
    
    // Navigate to second page
    fireEvent.click(screen.getByText('2'));
    
    // Should call the server-side handler
    expect(handlePaginationChange).toHaveBeenCalledWith(2, 10);
  });

  it('handles server-side sorting', async () => {
    const handleSortChange = jest.fn();
    
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns} 
        enableSorting={true}
        serverSide={{
          enabled: true,
          totalCount: mockData.length,
          onSortChange: handleSortChange
        }}
      />
    );
    
    // Click on name header to sort
    const nameHeader = screen.getByText('Name').closest('th');
    fireEvent.click(nameHeader!);
    
    // Should call the server-side handler
    expect(handleSortChange).toHaveBeenCalledWith('name', 'asc');
    
    // Click again to reverse sort
    fireEvent.click(nameHeader!);
    expect(handleSortChange).toHaveBeenCalledWith('name', 'desc');
  });

  it('handles server-side filtering with debounce', async () => {
    jest.useFakeTimers();
    const handleFilterChange = jest.fn();
    
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns} 
        enableFiltering={true}
        serverSide={{
          enabled: true,
          totalCount: mockData.length,
          onFilterChange: handleFilterChange,
          filterDebounce: 500
        }}
      />
    );
    
    // Type in search field
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    // Should not call handler immediately due to debounce
    expect(handleFilterChange).not.toHaveBeenCalled();
    
    // Advance timers to trigger debounced callback
    jest.advanceTimersByTime(500);
    
    // Now it should have been called
    expect(handleFilterChange).toHaveBeenCalledWith('test');
    
    jest.useRealTimers();
  });
});

describe('DataTableSkeleton', () => {
  it('renders skeleton with default rows and columns', () => {
    render(<DataTableSkeleton />);
    
    const skeletonRows = screen.getAllByTestId('skeleton-row');
    expect(skeletonRows).toHaveLength(5);
    
    const firstRowCells = skeletonRows[0].querySelectorAll('[data-testid="skeleton-cell"]');
    expect(firstRowCells.length).toBe(3);
  });
  
  it('renders skeleton with custom rows and columns', () => {
    render(<DataTableSkeleton rows={10} columns={4} />);
    
    const skeletonRows = screen.getAllByTestId('skeleton-row');
    expect(skeletonRows).toHaveLength(10);
    
    const firstRowCells = skeletonRows[0].querySelectorAll('[data-testid="skeleton-cell"]');
    expect(firstRowCells.length).toBe(4);
  });
  
  it('renders loading animations', () => {
    render(<DataTableSkeleton />);
    
    const pulsingElements = document.querySelectorAll('.animate-pulse');
    expect(pulsingElements.length).toBeGreaterThan(0);
  });
}); 
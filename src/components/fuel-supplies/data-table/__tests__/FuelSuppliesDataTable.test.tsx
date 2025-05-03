import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FuelSuppliesDataTable } from '../FuelSuppliesDataTable';
import { FuelSupply } from '@/types';

// Mock the DataTable component from the composed layer
jest.mock('@/components/ui/composed/data-table', () => ({
  DataTable: ({ data, columns, caption, loading }: any) => (
    <div data-testid="mock-data-table">
      <div>Columns: {columns.length}</div>
      <div>Data: {data.length}</div>
      {caption && <div>Caption: {caption}</div>}
      {loading && <div>Loading...</div>}
    </div>
  ),
}));

// Mock the translations
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock the responsive hook
jest.mock('@/hooks/useResponsive', () => ({
  useMediaQuery: () => false, // default to desktop view
}));

describe('FuelSuppliesDataTable', () => {
  const mockData: FuelSupply[] = [
    {
      id: '1',
      delivery_date: '2023-06-15T10:00:00Z',
      provider: { id: 'p1', name: 'Gas Company' },
      tank: { 
        id: 't1', 
        name: 'Tank 1', 
        fuel_type: 'Diesel',
        capacity: 1000,
        current_level: 500
      },
      quantity_liters: 200,
      price_per_liter: 400,
      total_cost: 80000,
      employee: { id: 'e1', name: 'John Doe' },
      comments: 'Regular delivery'
    },
    {
      id: '2',
      delivery_date: '2023-06-20T15:30:00Z',
      provider: { id: 'p2', name: 'Petrol Inc' },
      tank: { 
        id: 't2', 
        name: 'Tank 2', 
        fuel_type: 'Gasoline',
        capacity: 2000,
        current_level: 1200
      },
      quantity_liters: 300,
      price_per_liter: 450,
      total_cost: 135000,
      employee: { id: 'e2', name: 'Jane Smith' },
      comments: 'Urgent delivery'
    }
  ];

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the DataTable with correct props', () => {
    render(
      <FuelSuppliesDataTable 
        data={mockData} 
        isLoading={false} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );
    
    const dataTable = screen.getByTestId('mock-data-table');
    expect(dataTable).toBeInTheDocument();
    expect(dataTable).toHaveTextContent('Data: 2');
    expect(dataTable).not.toHaveTextContent('Loading...');
  });

  it('shows loading state when isLoading is true', () => {
    render(
      <FuelSuppliesDataTable 
        data={mockData} 
        isLoading={true} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(screen.getByTestId('mock-data-table')).toHaveTextContent('Loading...');
  });

  it('renders mobile view when on mobile device', () => {
    // Override the mock to return true for mobile
    jest.mocked(require('@/hooks/useResponsive').useMediaQuery).mockReturnValue(true);
    
    render(
      <FuelSuppliesDataTable 
        data={mockData} 
        isLoading={false} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );
    
    // Check for mobile-specific rendering
    expect(screen.getAllByTestId('mobile-card')).toHaveLength(2);
  });

  it('calls onEdit when edit button is clicked in mobile view', () => {
    // Override the mock to return true for mobile
    jest.mocked(require('@/hooks/useResponsive').useMediaQuery).mockReturnValue(true);
    
    render(
      <FuelSuppliesDataTable 
        data={mockData} 
        isLoading={false} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );
    
    // Click the edit button in the first card
    const editButtons = screen.getAllByTestId('edit-button');
    fireEvent.click(editButtons[0]);
    
    expect(mockOnEdit).toHaveBeenCalledWith(mockData[0]);
  });

  it('calls onDelete when delete button is clicked in mobile view', () => {
    // Override the mock to return true for mobile
    jest.mocked(require('@/hooks/useResponsive').useMediaQuery).mockReturnValue(true);
    
    render(
      <FuelSuppliesDataTable 
        data={mockData} 
        isLoading={false} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );
    
    // Click the delete button in the first card
    const deleteButtons = screen.getAllByTestId('delete-button');
    fireEvent.click(deleteButtons[0]);
    
    expect(mockOnDelete).toHaveBeenCalledWith(mockData[0]);
  });
}); 
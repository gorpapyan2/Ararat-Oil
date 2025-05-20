import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StandardizedDataTable } from '../StandardizedDataTable';

describe('StandardizedDataTable', () => {
  // Mock data for testing
  const testData = [
    { id: '1', name: 'Test Item 1', value: 100, status: 'active' },
    { id: '2', name: 'Test Item 2', value: 200, status: 'inactive' },
    { id: '3', name: 'Test Item 3', value: 300, status: 'pending' },
  ];

  // Mock columns for testing
  const testColumns = [
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Value',
      accessorKey: 'value',
      cell: (value: number) => `$${value}`,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (value: string) => (
        <span data-testid={`status-${value}`}>{value}</span>
      ),
    },
  ];

  it('renders the table with data', () => {
    render(
      <StandardizedDataTable 
        columns={testColumns} 
        data={testData} 
      />
    );
    
    // Check if column headers are rendered
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    
    // Check if data is rendered
    expect(screen.getByText('Test Item 1')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
    expect(screen.getByTestId('status-active')).toBeInTheDocument();
  });

  it('handles row click events', async () => {
    const handleRowClick = jest.fn();
    
    render(
      <StandardizedDataTable 
        columns={testColumns} 
        data={testData} 
        onRowClick={handleRowClick}
      />
    );
    
    // Click the first row
    const row = screen.getByText('Test Item 1').closest('tr');
    if (row) {
      fireEvent.click(row);
    }
    
    // Check if the handler was called with the correct data
    expect(handleRowClick).toHaveBeenCalledWith(testData[0]);
  });

  it('handles edit and delete actions', async () => {
    const handleEdit = jest.fn();
    const handleDelete = jest.fn();
    
    render(
      <StandardizedDataTable 
        columns={testColumns} 
        data={testData} 
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
    
    // Get edit button for first row and click it
    const editButtons = screen.getAllByLabelText('Edit');
    fireEvent.click(editButtons[0]);
    
    // Check if edit handler was called with correct ID
    expect(handleEdit).toHaveBeenCalledWith('1');
    
    // Get delete button for first row and click it
    const deleteButtons = screen.getAllByLabelText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    // Check if delete handler was called with correct ID
    expect(handleDelete).toHaveBeenCalledWith('1');
  });

  it('renders empty state when no data', () => {
    render(
      <StandardizedDataTable 
        columns={testColumns} 
        data={[]} 
      />
    );
    
    // Check if empty state is rendered
    expect(screen.getByText('No results.')).toBeInTheDocument();
  });

  it('handles loading state correctly', () => {
    render(
      <StandardizedDataTable 
        columns={testColumns} 
        data={testData}
        loading={true}
      />
    );
    
    // Check if loading state is shown
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('supports custom cell renderers', () => {
    render(
      <StandardizedDataTable 
        columns={testColumns} 
        data={testData} 
      />
    );
    
    // Check if custom cell render for value column works
    expect(screen.getByText('$100')).toBeInTheDocument();
    expect(screen.getByText('$200')).toBeInTheDocument();
    expect(screen.getByText('$300')).toBeInTheDocument();
    
    // Check if custom cell render for status column works
    expect(screen.getByTestId('status-active')).toBeInTheDocument();
    expect(screen.getByTestId('status-inactive')).toBeInTheDocument();
    expect(screen.getByTestId('status-pending')).toBeInTheDocument();
  });

  // Tests for pagination functionality could be added here
  // Tests for sorting functionality could be added here
  // Tests for filtering functionality could be added here
}); 
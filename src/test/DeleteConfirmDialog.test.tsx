import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DeleteConfirmDialog } from '@/components/ui/composed/dialog';

// Mock useMediaQuery hook
vi.mock('@/hooks/use-media-query', () => ({
  useMediaQuery: () => true
}));

describe('DeleteConfirmDialog', () => {
  it('renders dialog content when open', () => {
    // Arrange
    const onOpenChange = vi.fn();
    const onConfirm = vi.fn();
    const title = 'Delete Item';
    const description = 'Are you sure you want to delete this item?';
    
    // Act
    render(
      <DeleteConfirmDialog 
        open={true} 
        onOpenChange={onOpenChange} 
        onConfirm={onConfirm}
        title={title}
        description={description}
      />
    );
    
    // Assert
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
    expect(screen.getByText(/delete/i)).toBeInTheDocument();
    expect(screen.getByText(/cancel/i)).toBeInTheDocument();
  });
  
  it('does not render dialog content when closed', () => {
    // Arrange
    const onOpenChange = vi.fn();
    const onConfirm = vi.fn();
    const title = 'Delete Item';
    
    // Act
    render(
      <DeleteConfirmDialog 
        open={false} 
        onOpenChange={onOpenChange} 
        onConfirm={onConfirm}
        title={title}
        description="Are you sure you want to delete this item?"
      />
    );
    
    // Assert
    expect(screen.queryByText(title)).not.toBeInTheDocument();
  });
  
  it('calls onConfirm when delete button is clicked', () => {
    // Arrange
    const onOpenChange = vi.fn();
    const onConfirm = vi.fn();
    
    // Act
    render(
      <DeleteConfirmDialog 
        open={true} 
        onOpenChange={onOpenChange} 
        onConfirm={onConfirm}
        title="Delete Item"
        description="Are you sure you want to delete this item?"
      />
    );
    
    const deleteButton = screen.getByText(/delete/i);
    fireEvent.click(deleteButton);
    
    // Assert
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
  
  it('calls onCancel when cancel button is clicked', () => {
    // Arrange
    const onOpenChange = vi.fn();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    
    // Act
    render(
      <DeleteConfirmDialog 
        open={true} 
        onOpenChange={onOpenChange} 
        onConfirm={onConfirm}
        onCancel={onCancel}
        title="Delete Item"
        description="Are you sure you want to delete this item?"
      />
    );
    
    const cancelButton = screen.getByText(/cancel/i);
    fireEvent.click(cancelButton);
    
    // Assert
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
  
  it('disables buttons when in loading state', () => {
    // Arrange
    const onOpenChange = vi.fn();
    const onConfirm = vi.fn();
    
    // Act
    render(
      <DeleteConfirmDialog 
        open={true} 
        onOpenChange={onOpenChange} 
        onConfirm={onConfirm}
        title="Delete Item"
        description="Are you sure you want to delete this item?"
        isLoading={true}
      />
    );
    
    const deleteButton = screen.getByText(/delete/i);
    const cancelButton = screen.getByText(/cancel/i);
    
    // Assert
    expect(deleteButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });
  
  it('uses custom button text when provided', () => {
    // Arrange
    const onOpenChange = vi.fn();
    const onConfirm = vi.fn();
    const deleteText = 'Remove Forever';
    const cancelText = 'Go Back';
    
    // Act
    render(
      <DeleteConfirmDialog 
        open={true} 
        onOpenChange={onOpenChange} 
        onConfirm={onConfirm}
        title="Delete Item"
        description="Are you sure you want to delete this item?"
        deleteText={deleteText}
        cancelText={cancelText}
      />
    );
    
    // Assert
    expect(screen.getByText(deleteText)).toBeInTheDocument();
    expect(screen.getByText(cancelText)).toBeInTheDocument();
  });
}); 
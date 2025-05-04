import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ConfirmDialog } from '@/components/ui/composed/dialog';

// Mock useMediaQuery hook
vi.mock('@/hooks/use-media-query', () => ({
  useMediaQuery: () => true
}));

describe('ConfirmDialog', () => {
  it('renders dialog content when open', () => {
    // Arrange
    const onOpenChange = vi.fn();
    const onConfirm = vi.fn();
    const title = 'Confirm Action';
    const description = 'Are you sure you want to perform this action?';
    
    // Act
    render(
      <ConfirmDialog 
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
    expect(screen.getByText(/confirm/i)).toBeInTheDocument();
    expect(screen.getByText(/cancel/i)).toBeInTheDocument();
  });
  
  it('does not render dialog content when closed', () => {
    // Arrange
    const onOpenChange = vi.fn();
    const onConfirm = vi.fn();
    const title = 'Confirm Action';
    
    // Act
    render(
      <ConfirmDialog 
        open={false} 
        onOpenChange={onOpenChange} 
        onConfirm={onConfirm}
        title={title}
        description="Are you sure you want to perform this action?"
      />
    );
    
    // Assert
    expect(screen.queryByText(title)).not.toBeInTheDocument();
  });
  
  it('calls onConfirm when confirm button is clicked', () => {
    // Arrange
    const onOpenChange = vi.fn();
    const onConfirm = vi.fn();
    
    // Act
    render(
      <ConfirmDialog 
        open={true} 
        onOpenChange={onOpenChange} 
        onConfirm={onConfirm}
        title="Confirm Action"
        description="Are you sure you want to perform this action?"
      />
    );
    
    const confirmButton = screen.getByText(/confirm/i);
    fireEvent.click(confirmButton);
    
    // Assert
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
  
  it('calls onCancel when cancel button is clicked', () => {
    // Arrange
    const onOpenChange = vi.fn();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    
    // Act
    render(
      <ConfirmDialog 
        open={true} 
        onOpenChange={onOpenChange} 
        onConfirm={onConfirm}
        onCancel={onCancel}
        title="Confirm Action"
        description="Are you sure you want to perform this action?"
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
      <ConfirmDialog 
        open={true} 
        onOpenChange={onOpenChange} 
        onConfirm={onConfirm}
        title="Confirm Action"
        description="Are you sure you want to perform this action?"
        isLoading={true}
      />
    );
    
    const confirmButton = screen.getByText(/confirm/i);
    const cancelButton = screen.getByText(/cancel/i);
    
    // Assert
    expect(confirmButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });
  
  it('renders custom button text when provided', () => {
    // Arrange
    const onOpenChange = vi.fn();
    const onConfirm = vi.fn();
    const confirmText = 'Accept';
    const cancelText = 'Decline';
    
    // Act
    render(
      <ConfirmDialog 
        open={true} 
        onOpenChange={onOpenChange} 
        onConfirm={onConfirm}
        title="Confirm Action"
        description="Are you sure you want to perform this action?"
        confirmText={confirmText}
        cancelText={cancelText}
      />
    );
    
    // Assert
    expect(screen.getByText(confirmText)).toBeInTheDocument();
    expect(screen.getByText(cancelText)).toBeInTheDocument();
  });
  
  it('renders children content when provided', () => {
    // Arrange
    const onOpenChange = vi.fn();
    const onConfirm = vi.fn();
    const childContent = 'Additional information for this confirmation dialog';
    
    // Act
    render(
      <ConfirmDialog 
        open={true} 
        onOpenChange={onOpenChange} 
        onConfirm={onConfirm}
        title="Confirm Action"
        description="Are you sure you want to perform this action?"
      >
        <p>{childContent}</p>
      </ConfirmDialog>
    );
    
    // Assert
    expect(screen.getByText(childContent)).toBeInTheDocument();
  });
}); 

// Since we don't have the full file, I'm creating a minimal version that should work
import React from 'react';
import { StandardDialog } from '@/core/components/ui/primitives/dialog';
import { Button } from '@/core/components/ui/primitives/button';
import { Dispatch, SetStateAction } from 'react';

interface ConfirmationDialogStandardizedProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  title: string;
  description?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  children?: React.ReactNode;
  maxWidth?: string;
}

export function ConfirmationDialogStandardized({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  children,
  maxWidth,
}: ConfirmationDialogStandardizedProps) {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onOpenChange(false);
  };

  const actions = (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={handleCancel}>
        {cancelText}
      </Button>
      <Button onClick={handleConfirm}>
        {confirmText}
      </Button>
    </div>
  );

  return (
    <StandardDialog 
      open={open} 
      onOpenChange={onOpenChange} 
      title={title}
      description={description}
      actions={actions}
      maxWidth={maxWidth}
    >
      {children}
    </StandardDialog>
  );
}

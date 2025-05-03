import React from "react";
import { Button } from "@/components/ui/button";
import {
  StandardDialog,
  ConfirmDialog,
  AlertMessageDialog,
  DeleteConfirmDialog,
} from "@/components/ui/dialog";
import {
  useDialog,
  useConfirmDialog,
  useAlertDialog,
} from "@/hooks/useDialog";

export function DialogExamples() {
  // Standard dialog example
  const standardDialog = useDialog();
  
  // Confirm dialog example
  const confirmDialog = useConfirmDialog({
    onConfirm: () => {
      console.log("Confirmed action");
      // Simulate API call or other async action
      return new Promise(resolve => setTimeout(resolve, 1000));
    },
    onCancel: () => {
      console.log("Canceled action");
    },
  });
  
  // Alert dialog example
  const alertDialog = useAlertDialog();
  
  // Delete confirm dialog example
  const deleteDialog = useConfirmDialog({
    onConfirm: () => {
      console.log("Delete confirmed");
      // Simulate API call or other async action
      return new Promise(resolve => setTimeout(resolve, 1000));
    },
    onCancel: () => {
      console.log("Delete canceled");
    },
  });
  
  return (
    <div className="space-y-10 p-6">
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Dialog Examples</h2>
        <p className="text-muted-foreground">
          Examples of the standardized dialog components.
        </p>
      </section>
      
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Standard Dialog</h3>
        <p className="text-muted-foreground">
          A basic dialog with customizable content and actions.
        </p>
        <Button onClick={standardDialog.open}>Open Standard Dialog</Button>
        
        <StandardDialog
          open={standardDialog.isOpen}
          onOpenChange={standardDialog.onOpenChange}
          triggerRef={standardDialog.triggerRef}
          title="Standard Dialog Example"
          description="This is a standard dialog with customizable content and actions."
          actions={
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={standardDialog.close}>
                Cancel
              </Button>
              <Button onClick={standardDialog.close}>Continue</Button>
            </div>
          }
        >
          <div className="py-4">
            <p>
              You can put any content here, including forms, text, images, or
              other components.
            </p>
          </div>
        </StandardDialog>
      </section>
      
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Confirm Dialog</h3>
        <p className="text-muted-foreground">
          A dialog for confirming user actions with confirm/cancel buttons.
        </p>
        <Button onClick={confirmDialog.open}>Open Confirm Dialog</Button>
        
        <ConfirmDialog
          open={confirmDialog.isOpen}
          onOpenChange={confirmDialog.onOpenChange}
          triggerRef={confirmDialog.triggerRef}
          title="Confirm Action"
          description="Are you sure you want to perform this action? This cannot be undone."
          onConfirm={confirmDialog.onConfirm}
          onCancel={confirmDialog.onCancel}
          confirmText="Yes, Continue"
          cancelText="No, Cancel"
          isLoading={confirmDialog.isLoading}
        />
      </section>
      
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Alert Dialog</h3>
        <p className="text-muted-foreground">
          A dialog for displaying important information to users.
        </p>
        <div className="flex space-x-2">
          <Button 
            onClick={() => 
              alertDialog.open({
                title: "Information",
                description: "This is an informational message.",
                severity: "info",
              })
            }
          >
            Info Alert
          </Button>
          <Button 
            variant="secondary"
            onClick={() => 
              alertDialog.open({
                title: "Warning",
                description: "This is a warning message. Proceed with caution.",
                severity: "warning",
              })
            }
          >
            Warning Alert
          </Button>
          <Button 
            variant="destructive"
            onClick={() => 
              alertDialog.open({
                title: "Error",
                description: "An error has occurred. Please try again later.",
                severity: "danger",
              })
            }
          >
            Error Alert
          </Button>
        </div>
        
        <AlertMessageDialog
          open={alertDialog.isOpen}
          onOpenChange={alertDialog.onOpenChange}
          triggerRef={alertDialog.triggerRef}
          title={alertDialog.title}
          description={alertDialog.description}
          severity={alertDialog.severity}
          buttonText="Acknowledge"
        />
      </section>
      
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Delete Confirmation Dialog</h3>
        <p className="text-muted-foreground">
          A specialized dialog for confirming deletion actions.
        </p>
        <Button variant="destructive" onClick={deleteDialog.open}>
          Delete Item
        </Button>
        
        <DeleteConfirmDialog
          open={deleteDialog.isOpen}
          onOpenChange={deleteDialog.onOpenChange}
          triggerRef={deleteDialog.triggerRef}
          title="Delete Item"
          description="Are you sure you want to delete this item? This action cannot be undone and all associated data will be permanently lost."
          onConfirm={deleteDialog.onConfirm}
          onCancel={deleteDialog.onCancel}
          isLoading={deleteDialog.isLoading}
        />
      </section>
    </div>
  );
} 
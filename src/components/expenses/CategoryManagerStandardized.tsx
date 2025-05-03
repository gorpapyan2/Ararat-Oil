import { useState } from "react";
import { StandardDialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface CategoryManagerProps {
  categories: string[];
  onAdd: (cat: string) => void;
  onDelete: (cat: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CategoryManagerStandardized({
  categories,
  onAdd,
  onDelete,
  open,
  onOpenChange,
}: CategoryManagerProps) {
  const [newCat, setNewCat] = useState("");
  
  return (
    <StandardDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Manage Categories"
      description="Add, edit, or remove expense categories."
      maxWidth="sm:max-w-[400px]"
      actions={
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      }
    >
      <div className="space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (newCat.trim().length) {
              onAdd(newCat.trim());
              setNewCat("");
            }
          }}
          className="flex gap-2"
        >
          <Input
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="New category"
            autoFocus
          />
          <Button type="submit" variant="secondary">
            Add
          </Button>
        </form>

        <div className="max-h-[300px] overflow-y-auto space-y-1 border rounded-md p-2">
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-2">
              No categories yet. Add your first category above.
            </p>
          ) : (
            categories.map((c) => (
              <div
                key={c}
                className="flex items-center px-2 py-1 rounded group hover:bg-muted"
              >
                <span className="flex-1">{c}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => onDelete(c)}
                  aria-label={`Delete ${c} category`}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </StandardDialog>
  );
} 

import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronDown } from "lucide-react";

interface CategoryManagerProps {
  categories: string[];
  onAdd: (cat: string) => void;
  onDelete: (cat: string) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}

export function CategoryManager({
  categories,
  onAdd,
  onDelete,
  open,
  setOpen,
}: CategoryManagerProps) {
  const [newCat, setNewCat] = useState("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <form
            onSubmit={e => {
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
              onChange={e => setNewCat(e.target.value)}
              placeholder="New category"
              autoFocus
            />
            <Button type="submit" variant="secondary">Add</Button>
          </form>
          <div className="space-y-1">
            {categories.map(c => (
              <div key={c} className="flex items-center px-2 py-1 rounded group hover:bg-muted">
                <span className="flex-1">{c}</span>
                <Button
                  variant="destructive"
                  size="icon"
                  className="ml-2"
                  onClick={() => onDelete(c)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

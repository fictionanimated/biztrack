
"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription as AlertDialogDesc,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface ManageCategoriesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoriesUpdated: () => void;
}

export function ManageCategoriesDialog({ open, onOpenChange, onCategoriesUpdated }: ManageCategoriesDialogProps) {
  const [expenseCategories, setExpenseCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<{ oldName: string; newName: string } | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchCategories() {
      if (open) {
        try {
          const res = await fetch('/api/expenses/categories');
          if (!res.ok) throw new Error('Failed to fetch categories');
          const data = await res.json();
          setExpenseCategories(data);
        } catch (error) {
          toast({ variant: "destructive", title: "Error", description: "Could not load categories." });
        }
      }
    }
    fetchCategories();
  }, [open, toast]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim() && !expenseCategories.some(cat => cat.toLowerCase() === newCategory.trim().toLowerCase())) {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/expenses/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCategory.trim() }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add category');
            }
            const addedCategory = await response.json();
            setExpenseCategories(prev => [...prev, addedCategory.name].sort());
            setNewCategory("");
            toast({ title: "Category Added" });
            onCategoriesUpdated();
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: (error as Error).message });
        } finally {
            setIsSubmitting(false);
        }
    } else {
        toast({ variant: "destructive", title: "Error", description: "Category is empty or already exists." });
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;
    const { oldName, newName } = editingCategory;
    const trimmedNewName = newName.trim();

    if (!trimmedNewName) return;
    setIsSubmitting(true);

    try {
        const response = await fetch('/api/expenses/categories', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ oldName, newName: trimmedNewName }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update category');
        }
        setExpenseCategories(prev => prev.map(cat => cat === oldName ? trimmedNewName : cat).sort());
        toast({ title: "Category Updated" });
        setEditingCategory(null);
        onCategoriesUpdated();
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: (error as Error).message });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
      if (!deletingCategory) return;
      setIsSubmitting(true);
      try {
          const response = await fetch('/api/expenses/categories', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: deletingCategory }),
          });
          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to delete category');
          }
          setExpenseCategories(prev => prev.filter(cat => cat !== deletingCategory));
          toast({ title: "Category Deleted" });
          onCategoriesUpdated();
      } catch (error) {
           toast({ variant: "destructive", title: "Error", description: (error as Error).message });
      } finally {
          setIsSubmitting(false);
          setDeletingCategory(null);
      }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Manage Expense Categories</DialogTitle>
                  <DialogDescription>Add, edit, or delete expense categories.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddCategory} className="space-y-4 pt-4">
                  <div className="flex items-center gap-2">
                      <Input 
                          value={newCategory} 
                          onChange={(e) => setNewCategory(e.target.value)}
                          placeholder="New category name"
                          disabled={!!editingCategory}
                      />
                      <Button type="submit" disabled={!!editingCategory || isSubmitting}>
                          {isSubmitting && !editingCategory ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Add"}
                      </Button>
                  </div>
              </form>
              <div className="space-y-2">
                  <p className="text-sm font-medium">Existing Categories:</p>
                  <div className="max-h-60 space-y-1 overflow-y-auto pr-2">
                      {expenseCategories.map(cat => (
                          <div key={cat} className="group flex h-12 items-center justify-between rounded-md border p-2">
                              {editingCategory?.oldName === cat ? (
                                  <div className="flex w-full items-center gap-2">
                                      <Input
                                          value={editingCategory.newName}
                                          onChange={(e) => setEditingCategory({ ...editingCategory, newName: e.target.value })}
                                          className="h-8"
                                          autoFocus
                                          onKeyDown={(e) => {
                                              if (e.key === 'Enter') { e.preventDefault(); handleUpdateCategory(); }
                                              if (e.key === 'Escape') setEditingCategory(null);
                                          }}
                                      />
                                      <Button size="sm" onClick={handleUpdateCategory} className="h-8" disabled={isSubmitting}>
                                          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                                      </Button>
                                      <Button size="sm" variant="ghost" onClick={() => setEditingCategory(null)} className="h-8">Cancel</Button>
                                  </div>
                              ) : (
                                  <>
                                      <span className="text-sm">{cat}</span>
                                      <div className="flex items-center opacity-0 transition-opacity group-hover:opacity-100">
                                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingCategory({ oldName: cat, newName: cat })}>
                                              <Pencil className="h-4 w-4" />
                                          </Button>
                                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeletingCategory(cat)}>
                                              <Trash2 className="h-4 w-4" />
                                          </Button>
                                      </div>
                                  </>
                              )}
                          </div>
                      ))}
                  </div>
              </div>
              <DialogFooter>
                  <DialogClose asChild>
                      <Button type="button" variant="secondary" onClick={() => setEditingCategory(null)}>Close</Button>
                  </DialogClose>
              </DialogFooter>
          </DialogContent>
      </Dialog>
      <AlertDialog open={!!deletingCategory} onOpenChange={(open) => !open && setDeletingCategory(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDesc>
                This will permanently delete the category "{deletingCategory}". This action cannot be undone.
            </AlertDialogDesc>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory} className="bg-destructive hover:bg-destructive/90" disabled={isSubmitting}>
                 {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

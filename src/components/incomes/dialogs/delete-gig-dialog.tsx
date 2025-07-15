
"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { Gig } from "@/lib/data/incomes-data";

interface DeleteGigDialogProps {
  gigToDelete: { gig: Gig; sourceId: string };
  onOpenChange: (open: boolean) => void;
  onGigDeleted: (gig: Gig, sourceId: string) => void;
}

export function DeleteGigDialog({ gigToDelete, onOpenChange, onGigDeleted }: DeleteGigDialogProps) {
  const [deleteStep, setDeleteStep] = useState(1);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const closeDialog = () => {
    onOpenChange(false);
    setTimeout(() => {
        setDeleteStep(0);
        setDeleteConfirmInput("");
    }, 300);
  };

  async function handleDeleteGig() {
      if (!gigToDelete) return;
      const { gig, sourceId } = gigToDelete;

      if (deleteConfirmInput !== gig.name) {
          toast({ variant: "destructive", title: "Error", description: "The typed name does not match." });
          return;
      }
      setIsSubmitting(true);
      
      try {
          const response = await fetch(`/api/incomes/${sourceId}/gigs/${gig.id}`, {
              method: 'DELETE',
          });

          if (!response.ok) {
              throw new Error('Failed to delete gig');
          }

          onGigDeleted(gig, sourceId);
      
          toast({
              title: "Gig Deleted",
              description: `"${gig.name}" has been permanently removed.`,
          });

          closeDialog();
      } catch (error) {
          console.error(error);
          toast({
              variant: "destructive",
              title: "Error",
              description: "Could not delete the gig. Please try again.",
          });
      } finally {
          setIsSubmitting(false);
      }
  };

  return (
    <Dialog open={!!gigToDelete} onOpenChange={onOpenChange}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
          <DialogHeader>
              <DialogTitle>
                  {deleteStep === 1 && "Are you sure?"}
                  {deleteStep === 2 && "This action is permanent"}
                  {deleteStep === 3 && "Final Confirmation"}
              </DialogTitle>
              <DialogDescription>
                  {deleteStep === 1 && `You are about to delete the gig "${gigToDelete?.gig.name}". This cannot be undone.`}
                  {deleteStep === 2 && `All data for "${gigToDelete?.gig.name}" will be permanently removed. This is your second warning.`}
                  {deleteStep === 3 && <>To confirm, please type <strong className="text-foreground">{gigToDelete?.gig.name}</strong> below.</>}
              </DialogDescription>
          </DialogHeader>
          {deleteStep === 3 && (
              <Input
                  value={deleteConfirmInput}
                  onChange={(e) => setDeleteConfirmInput(e.target.value)}
                  placeholder="Type gig name to confirm"
                  autoFocus
              />
          )}
          <DialogFooter>
              <Button variant="outline" onClick={closeDialog}>Cancel</Button>
              {deleteStep === 1 && <Button onClick={() => setDeleteStep(2)}>Continue</Button>}
              {deleteStep === 2 && <Button variant="destructive" onClick={() => setDeleteStep(3)}>I Understand, Delete</Button>}
              {deleteStep === 3 && <Button variant="destructive" disabled={deleteConfirmInput !== gigToDelete?.gig.name || isSubmitting} onClick={handleDeleteGig}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Delete Permanently
              </Button>}
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

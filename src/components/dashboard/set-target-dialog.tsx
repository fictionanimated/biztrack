"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";

interface SetTargetDialogProps {
  currentTarget: number;
  onSetTarget: (newTarget: number) => void;
}

export function SetTargetDialog({
  currentTarget,
  onSetTarget,
}: SetTargetDialogProps) {
  const [target, setTarget] = useState(
    currentTarget > 0 ? currentTarget.toString() : ""
  );
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    const newTarget = parseFloat(target);
    if (!isNaN(newTarget)) {
      onSetTarget(newTarget);
      setOpen(false); // Close dialog on save
    }
  };

  // Update internal state if the prop changes
  useState(() => {
    setTarget(currentTarget > 0 ? currentTarget.toString() : "");
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Set Target</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Monthly Target</DialogTitle>
          <DialogDescription>
            Set your revenue target for the selected month. This will help track
            your performance.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="target" className="text-right">
              Target
            </Label>
            <div className="relative col-span-3">
              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="target"
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="pl-8"
                placeholder="e.g., 50000"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Save Target</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

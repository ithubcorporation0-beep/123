"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ConfirmModalProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  disabled?: boolean;
}

export function ConfirmModal({
  children,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. This will permanently delete this item from our servers.",
  confirmText = "Continue",
  cancelText = "Cancel",
  onConfirm,
  disabled = false,
}: ConfirmModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
      setOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children as any} />
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading || disabled}
            onClick={() => setOpen(false)}
            className="rounded-xl"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isLoading || disabled}
            onClick={handleConfirm}
            className="rounded-xl"
          >
            {isLoading ? "Deleting..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

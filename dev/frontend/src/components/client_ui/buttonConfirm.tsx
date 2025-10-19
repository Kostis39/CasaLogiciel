"use client";
import { useState, ReactNode } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";

type ButtonProps = React.ComponentProps<typeof Button>;

type ConfirmButtonProps = {
  triggerText: string;
  title: string;
  description: string | ReactNode;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  variantConfirm?: "default" | "destructive" | "outline";
  // Nouveaux props pour le bouton trigger
  triggerSize?: ButtonProps["size"];
  triggerVariant?: ButtonProps["variant"];
  triggerClassName?: string;
};

export function ConfirmButton({
  triggerText,
  title,
  description,
  onConfirm,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  variantConfirm = "destructive",
  triggerSize = "lg",
  triggerVariant = "outline",
  triggerClassName = "",
}: ConfirmButtonProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <>
      {/* Bouton qui ouvre le modal */}
      <Button
        type="button"
        size={triggerSize}
        variant={triggerVariant}
        className={triggerClassName}
        onClick={() => setOpen(true)}
      >
        {triggerText}
      </Button>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <p className="py-2 text-sm text-gray-700">{description}</p>

          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {cancelText}
            </Button>
            <Button variant={variantConfirm} onClick={handleConfirm}>
              {confirmText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

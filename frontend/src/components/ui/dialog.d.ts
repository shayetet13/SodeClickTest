import React from 'react';

export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Dialog: React.FC<DialogProps>;
export const DialogTrigger: React.FC<React.HTMLAttributes<HTMLButtonElement>>;
export const DialogContent: React.FC<React.HTMLAttributes<HTMLDivElement>>;
export const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>>;
export const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>>;
export const DialogDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>>;
export const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>>;
export const VisuallyHidden: React.FC<React.HTMLAttributes<HTMLSpanElement>>;

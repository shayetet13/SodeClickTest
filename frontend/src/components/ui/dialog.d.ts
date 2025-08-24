import React from 'react';

export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface DialogTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {}
export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
export interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const Dialog: React.FC<DialogProps>;
export const DialogTrigger: React.FC<DialogTriggerProps>;
export const DialogContent: React.FC<DialogContentProps>;
export const DialogHeader: React.FC<DialogHeaderProps>;
export const DialogTitle: React.FC<DialogTitleProps>;
export const DialogDescription: React.FC<DialogDescriptionProps>;
export const DialogFooter: React.FC<DialogFooterProps>;
export const VisuallyHidden: React.FC<VisuallyHiddenProps>;

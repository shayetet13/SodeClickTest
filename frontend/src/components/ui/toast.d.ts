import React from 'react';

export interface ToastProviderProps {
  children: React.ReactNode;
}

export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

export const ToastProvider: React.FC<ToastProviderProps>;
export function useToast(): {
  toast: (options: ToastOptions) => void;
  dismiss: () => void;
  ToastContainer?: React.ComponentType;
};

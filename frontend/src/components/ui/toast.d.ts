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

export interface ToastContextType {
  toast: (options: ToastOptions) => void;
  ToastContainer?: React.ComponentType;
}

export const ToastProvider: React.FC<ToastProviderProps>;
export function useToast(): ToastContextType;

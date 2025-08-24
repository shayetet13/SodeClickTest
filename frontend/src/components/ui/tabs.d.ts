import React from 'react';

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: "discover" | "matches" | "messages" | "membership" | "profile";
  onValueChange?: (value: "discover" | "matches" | "messages" | "membership" | "profile") => void;
  orientation?: 'horizontal' | 'vertical';
}

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const Tabs: React.FC<TabsProps>;
export const TabsList: React.FC<React.HTMLAttributes<HTMLDivElement>>;
export const TabsTrigger: React.FC<TabsTriggerProps>;
export const TabsContent: React.FC<TabsContentProps>;

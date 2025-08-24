import React from 'react';

type TabValue = "membership" | "discover" | "matches" | "messages" | "profile";

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: TabValue;
  value?: TabValue;
  onValueChange?: (value: TabValue) => void;
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface TabsTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: TabValue;
}
export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: TabValue;
}

export const Tabs: React.FC<TabsProps>;
export const TabsList: React.FC<TabsListProps>;
export const TabsTrigger: React.FC<TabsTriggerProps>;
export const TabsContent: React.FC<TabsContentProps>;

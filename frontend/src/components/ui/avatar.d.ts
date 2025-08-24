import React from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  // Add any specific avatar props if needed
}

export const Avatar: React.FC<AvatarProps>;
export const AvatarImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>>;
export const AvatarFallback: React.FC<React.HTMLAttributes<HTMLDivElement>>;

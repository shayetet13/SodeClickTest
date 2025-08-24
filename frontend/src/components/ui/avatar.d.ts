import React from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  // Add any specific avatar props if needed
}

export interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}
export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const Avatar: React.FC<AvatarProps>;
export const AvatarImage: React.FC<AvatarImageProps>;
export const AvatarFallback: React.FC<AvatarFallbackProps>;

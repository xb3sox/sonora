import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circle' | 'rect';
}

export function Skeleton({ className = '', variant = 'rect' }: SkeletonProps) {
  const baseClasses = 'bg-sonora-sand animate-pulse';
  
  const variantClasses = {
    text: 'h-4 rounded',
    circle: 'rounded-full',
    rect: 'rounded-lg',
  };

  return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />;
}

export function TrackRowSkeleton() {
  return (
    <div className="flex items-center gap-3 p-2.5">
      <Skeleton className="w-6 h-4" variant="text" />
      <Skeleton className="w-9 h-9" variant="rect" />
      <div className="flex-1 space-y-2">
        <Skeleton className="w-3/4 h-4" variant="text" />
        <Skeleton className="w-1/2 h-3" variant="text" />
      </div>
      <Skeleton className="w-12 h-4" variant="text" />
    </div>
  );
}

export function AlbumCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-square w-full" variant="rect" />
      <Skeleton className="w-3/4 h-4" variant="text" />
      <Skeleton className="w-1/2 h-3" variant="text" />
    </div>
  );
}

export function ArtistCardSkeleton() {
  return (
    <div className="flex flex-col items-center space-y-3">
      <Skeleton className="w-20 h-20" variant="circle" />
      <Skeleton className="w-16 h-4" variant="text" />
    </div>
  );
}

export function PlaylistSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <Skeleton className="w-12 h-12" variant="rect" />
      <div className="flex-1 space-y-2">
        <Skeleton className="w-2/3 h-4" variant="text" />
        <Skeleton className="w-1/3 h-3" variant="text" />
      </div>
    </div>
  );
}

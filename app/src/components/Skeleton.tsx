import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({
  width = '100%',
  height = '20px',
  borderRadius = '8px',
  className = '',
  style,
}: SkeletonProps) {
  return (
    <div
      className={`skeleton-loader ${className}`}
      style={{ width, height, borderRadius, ...style }}
    />
  );
}

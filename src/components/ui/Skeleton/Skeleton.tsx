import type { CSSProperties } from 'react';

import { useReducedMotion } from '../../../hooks/useReducedMotion';
import tokens from '../../../tokens';

export type SkeletonProps = {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  testID?: string;
  style?: CSSProperties;
  className?: string;
};

export function Skeleton({
  width = '100%',
  height = 16,
  radius = 8,
  testID,
  style,
  className,
}: SkeletonProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      data-testid={testID}
      className={className}
      style={{
        width,
        height,
        borderRadius: radius,
        background:
          'linear-gradient(90deg, rgba(226,232,240,0.92) 0%, rgba(203,213,225,0.92) 50%, rgba(226,232,240,0.92) 100%)',
        animation: reduceMotion ? undefined : 'ui-pulse 0.8s ease-in-out infinite',
        ...style,
      }}
    />
  );
}

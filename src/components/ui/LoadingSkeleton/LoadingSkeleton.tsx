import type { CSSProperties } from 'react';

import tokens from '../../../tokens';
import { Card } from '../Card';
import { Skeleton } from '../Skeleton';

export type LoadingSkeletonProps = {
  itemCount?: number;
  showHeader?: boolean;
  showSearchBar?: boolean;
  testID?: string;
  style?: CSSProperties;
  className?: string;
};

export function LoadingSkeleton({
  itemCount = 3,
  showHeader = true,
  showSearchBar = true,
  testID,
  style,
  className,
}: LoadingSkeletonProps) {
  return (
    <section
      role="status"
      aria-label="読み込み中"
      data-testid={testID}
      className={className}
      style={{
        width: '100%',
        display: 'grid',
        gap: tokens.space4,
        ...style,
      }}
    >
      {showHeader ? (
        <div style={{ display: 'grid', gap: tokens.space2 }}>
          <Skeleton width="42%" height={28} radius={12} />
          <Skeleton width="68%" height={16} radius={8} />
        </div>
      ) : null}

      {showSearchBar ? <Skeleton height={tokens.controlHeightLg} radius={tokens.radiusLg} /> : null}

      <div style={{ display: 'grid', gap: tokens.space3 }}>
        {Array.from({ length: itemCount }).map((_, index) => (
          <Card key={index} padding="lg" elevated={false}>
            <div data-testid="loading-skeleton-card" style={{ display: 'grid', gap: tokens.space3 }}>
              <Skeleton width="48%" height={18} radius={9} />
              <Skeleton width="100%" height={14} radius={7} />
              <Skeleton width="82%" height={14} radius={7} />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

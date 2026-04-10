import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { FeatureFlagProvider, FeatureGate, useFeatureFlag } from './FeatureFlagProvider';

function FlagProbe() {
  const enabled = useFeatureFlag('newCheckout');
  return <span>{enabled ? 'on' : 'off'}</span>;
}

describe('FeatureFlagProvider', () => {
  test('override されたフラグを返す', () => {
    const { getByText } = render(
      <FeatureFlagProvider overrides={{ newCheckout: true }}>
        <FlagProbe />
      </FeatureFlagProvider>,
    );

    expect(getByText('on')).toBeInTheDocument();
  });

  test('FeatureGate で fallback を切り替える', () => {
    const { getByText } = render(
      <FeatureFlagProvider overrides={{ newCheckout: false }}>
        <FeatureGate flag="newCheckout" fallback={<div>fallback</div>}>
          <div>enabled</div>
        </FeatureGate>
      </FeatureFlagProvider>,
    );

    expect(getByText('fallback')).toBeInTheDocument();
  });
});

import { render } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import * as privacyConsentModule from '../../lib/privacyConsent';
import { PrivacyConsentProvider, usePrivacyConsent } from './PrivacyConsentProvider';

function ConsentProbe() {
  const { status } = usePrivacyConsent();
  return <span>{status}</span>;
}

describe('PrivacyConsentProvider', () => {
  afterEach(async () => {
    await privacyConsentModule.resetConsent();
    vi.restoreAllMocks();
  });

  test('現在の同意状態を context に流す', async () => {
    await privacyConsentModule.setConsent('granted');

    const { getByText } = render(
      <PrivacyConsentProvider>
        <ConsentProbe />
      </PrivacyConsentProvider>,
    );

    expect(getByText('granted')).toBeInTheDocument();
  });

  test('mount 時に現在の同意状態で同期する', async () => {
    const sync = vi.spyOn(privacyConsentModule, 'syncConsentServices').mockResolvedValue(undefined);

    render(
      <PrivacyConsentProvider>
        <ConsentProbe />
      </PrivacyConsentProvider>,
    );

    await vi.waitFor(() => {
      expect(sync).toHaveBeenCalledWith('undetermined');
    });
  });
});

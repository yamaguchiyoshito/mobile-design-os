import { fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { PrivacyConsentProvider } from '../../../components/providers';
import * as privacyConsentModule from '../../../lib/privacyConsent';
import { PrivacyConsentScreen } from './PrivacyConsentScreen';

describe('PrivacyConsentScreen', () => {
  afterEach(async () => {
    await privacyConsentModule.resetConsent();
    vi.restoreAllMocks();
  });

  test('同意して続行で granted を保存する', async () => {
    const onCompleted = vi.fn();

    const { getByRole } = render(
      <PrivacyConsentProvider>
        <PrivacyConsentScreen onCompleted={onCompleted} />
      </PrivacyConsentProvider>,
    );

    fireEvent.click(getByRole('button', { name: '同意して続行' }));

    await vi.waitFor(() => {
      expect(onCompleted).toHaveBeenCalledWith('granted');
    });
  });

  test('同意しないで denied を保存する', async () => {
    const setConsent = vi.spyOn(privacyConsentModule, 'setConsent').mockResolvedValue(undefined);

    const { getByRole } = render(
      <PrivacyConsentProvider>
        <PrivacyConsentScreen />
      </PrivacyConsentProvider>,
    );

    fireEvent.click(getByRole('button', { name: '同意しない' }));

    await vi.waitFor(() => {
      expect(setConsent).toHaveBeenCalledWith('denied');
    });
  });
});

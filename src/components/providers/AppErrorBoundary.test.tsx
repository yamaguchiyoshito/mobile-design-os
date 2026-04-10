import { fireEvent, render } from '@testing-library/react';
import { useState, type ReactElement } from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { crashlyticsService } from '../../lib/crashlytics';
import { logger } from '../../lib/logger';
import { ThemeProvider } from './ThemeProvider';
import { AppErrorBoundary } from './AppErrorBoundary';

function CrashView(): ReactElement {
  throw new Error('render failed');
}

function BoundaryHarness() {
  const [shouldCrash, setShouldCrash] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setShouldCrash(true);
        }}
      >
        crash
      </button>
      <AppErrorBoundary
        onReset={() => {
          setShouldCrash(false);
        }}
      >
        {shouldCrash ? <CrashView /> : <div>stable</div>}
      </AppErrorBoundary>
    </>
  );
}

describe('AppErrorBoundary', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('render error を fallback 表示に置き換える', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const capture = vi.spyOn(logger, 'capture').mockImplementation(() => undefined);
    const recordError = vi
      .spyOn(crashlyticsService, 'recordError')
      .mockResolvedValue(undefined);

    const { getByRole, getByText } = render(
      <ThemeProvider>
        <BoundaryHarness />
      </ThemeProvider>,
    );

    fireEvent.click(getByRole('button', { name: 'crash' }));

    expect(getByText('予期しないエラーが発生しました')).toBeInTheDocument();
    expect(getByRole('button', { name: '再試行' })).toBeInTheDocument();
    expect(capture).toHaveBeenCalled();
    expect(recordError).toHaveBeenCalled();

    fireEvent.click(getByRole('button', { name: '再試行' }));

    expect(getByText('stable')).toBeInTheDocument();
    consoleError.mockRestore();
  });
});

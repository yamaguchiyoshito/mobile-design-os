import { render } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';

import { themeStore } from '../../stores/themeStore';
import { ThemeProvider, useTheme } from './ThemeProvider';

function ThemeProbe() {
  const { colorScheme, preference } = useTheme();
  return (
    <div>
      <span>{colorScheme}</span>
      <span>{preference}</span>
    </div>
  );
}

describe('ThemeProvider', () => {
  afterEach(() => {
    themeStore.getState().reset();
  });

  test('store の dark 設定を反映する', () => {
    themeStore.getState().setColorScheme('dark');

    const { getByText, container } = render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );

    expect(container.querySelectorAll('span')).toHaveLength(2);
    expect(container).toHaveTextContent('darkdark');
    expect(container.firstChild).toHaveAttribute('data-color-scheme', 'dark');
    expect(document.documentElement.getAttribute('data-color-scheme')).toBe('dark');
  });
});

import { describe, expect, test } from 'vitest';

import { dispatchUrl, webViewSecurityPolicy } from './webViewSecurityPolicy';

describe('webViewSecurityPolicy', () => {
  test.each([
    ['https://example.com/terms', 'allow'],
    ['myapp://profile', 'deeplink'],
    ['mailto:support@example.com', 'external'],
    ['javascript:alert(1)', 'block'],
  ])('%s を %s に分類する', (url, action) => {
    expect(dispatchUrl(url)).toEqual({ action });
  });

  test('許可 origin を判定できる', () => {
    expect(webViewSecurityPolicy.default.isAllowed('https://example.com/help')).toBe(true);
    expect(webViewSecurityPolicy.default.isAllowed('https://evil.example.com/help')).toBe(false);
  });
});

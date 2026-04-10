import { describe, expect, test } from 'vitest';

import { webViewBridge } from './webViewBridge';

describe('webViewBridge', () => {
  test('受信 JSON を typed message に変換する', () => {
    const raw = JSON.stringify({
      type: 'PAYMENT_SUCCESS',
      payload: { transactionId: 'tx-001' },
    });

    expect(webViewBridge.parseIncoming(raw)).toEqual({
      type: 'PAYMENT_SUCCESS',
      payload: { transactionId: 'tx-001' },
    });
  });

  test('不正メッセージは null を返す', () => {
    expect(webViewBridge.parseIncoming('payment:ready')).toBeNull();
    expect(
      webViewBridge.parseIncoming(
        JSON.stringify({ type: 'OPEN_EXTERNAL', payload: { url: 'javascript:alert(1)' } }),
      ),
    ).toBeNull();
  });

  test('Native -> Web script を生成する', () => {
    const script = webViewBridge.buildInjectScript({
      type: 'INIT',
      payload: { authToken: 'token-1', locale: 'ja' },
    });

    expect(script).toContain('"type":"INIT"');
    expect(script).toContain('window.__nativeBridge__');
  });
});

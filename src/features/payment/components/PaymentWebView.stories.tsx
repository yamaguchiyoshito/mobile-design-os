import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { PaymentWebView } from './PaymentWebView';

const meta: Meta<typeof PaymentWebView> = {
  title: 'Feature/Payment/PaymentWebView',
  component: PaymentWebView,
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => {
    const [logs, setLogs] = useState<string[]>([]);

    return (
      <div style={{ padding: 24, display: 'grid', gap: 16 }}>
        <PaymentWebView
          {...args}
          onBridgeMessage={(message) => {
            setLogs((prev) => [...prev, JSON.stringify(message)]);
          }}
          onInitScriptReady={(script) => {
            setLogs((prev) => [...prev, `INIT:${script}`]);
          }}
        />
        {logs.length ? (
          <pre
            style={{
              margin: 0,
              padding: 16,
              borderRadius: 16,
              background: '#101828',
              color: '#FFFFFF',
              fontSize: 12,
              overflowX: 'auto',
            }}
          >
            {logs.join('\n')}
          </pre>
        ) : null}
      </div>
    );
  },
};

export default meta;

type Story = StoryObj<typeof PaymentWebView>;

export const Default: Story = {
  args: {
    paymentUrl: 'https://payment.example.com/checkout',
    getAuthTokenSync: () => 'payment-token-001',
    locale: 'ja',
    onSuccess: () => undefined,
    onCancel: () => undefined,
    injectedJS: `
      window.parent.postMessage(JSON.stringify({ type: 'READY' }), '*');
      setTimeout(() => {
        window.parent.postMessage(
          JSON.stringify({
            type: 'PAYMENT_SUCCESS',
            payload: { transactionId: 'txn-001' }
          }),
          '*'
        );
      }, 300);
    `,
  },
};

export const ErrorFlow: Story = {
  args: {
    paymentUrl: 'https://payment.example.com/checkout',
    getAuthTokenSync: () => 'payment-token-002',
    locale: 'ja',
    onSuccess: () => undefined,
    onCancel: () => undefined,
    injectedJS: `
      window.parent.postMessage(
        JSON.stringify({
          type: 'PAYMENT_ERROR',
          payload: { code: 'DECLINED', message: 'カード認証に失敗しました' }
        }),
        '*'
      );
    `,
  },
};

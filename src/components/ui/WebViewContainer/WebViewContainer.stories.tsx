import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { WebViewContainer } from './WebViewContainer';

const meta: Meta<typeof WebViewContainer> = {
  title: 'UI/WebViewContainer',
  component: WebViewContainer,
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => {
    const [logs, setLogs] = useState<string[]>([]);

    return (
      <div style={{ padding: 24, display: 'grid', gap: 16 }}>
        <WebViewContainer
          {...args}
          onMessage={(data) => setLogs((prev) => [...prev, data])}
          style={{ minHeight: 520 }}
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

type Story = StoryObj<typeof WebViewContainer>;

export const Default: Story = {
  args: {
    uri: 'https://example.com',
    title: '利用規約',
    allowedOrigins: ['https://example.com'],
  },
};

export const WithInjectedMessage: Story = {
  args: {
    uri: 'https://example.com',
    title: '支払い画面',
    allowedOrigins: ['https://example.com'],
    injectedJS: "window.parent.postMessage('payment:ready', '*');",
  },
};

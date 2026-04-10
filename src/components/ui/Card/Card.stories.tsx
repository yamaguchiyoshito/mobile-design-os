import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../Button';
import { Text } from '../Text';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  render: (args) => (
    <div style={{ width: 360 }}>
      <Card {...args} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    title: '注文サマリー',
    description: '現在のカート内容を確認できます。',
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Text as="p" variant="bodyMd">
          エチオピア ブレンド
        </Text>
        <Text as="p" variant="bodySm" tone="secondary">
          焙煎度: Medium / 200g
        </Text>
      </div>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    title: '注文サマリー',
    description: '購入前の最終確認',
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Text as="p" variant="bodyMd">
          合計金額
        </Text>
        <Text as="p" variant="headingMd">
          ¥4,320
        </Text>
      </div>
    ),
    footer: <Button label="注文を確定する" onPress={() => undefined} fullWidth />,
  },
};

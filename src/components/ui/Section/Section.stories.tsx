import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../Button';
import { FormField } from '../FormField';
import { Text } from '../Text';
import { Section } from './Section';

const meta: Meta<typeof Section> = {
  title: 'UI/Layout/Section',
  component: Section,
  parameters: {
    layout: 'centered',
  },
  render: (args) => (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <Section {...args} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof Section>;

export const Default: Story = {
  args: {
    title: '注文情報',
    description: '配送先と支払い方法を確認してください。',
    children: (
      <div style={{ display: 'grid', gap: 12 }}>
        <FormField label="配送先" value="東京都千代田区1-1-1" onChangeText={() => undefined} />
        <Text as="p" variant="bodySm" tone="secondary">
          次回以降もこの設定を利用します。
        </Text>
      </div>
    ),
  },
};

export const WithAside: Story = {
  args: {
    title: 'プロフィール',
    description: '表示名と連絡先を管理します。',
    aside: <Button label="編集する" variant="secondary" onPress={() => undefined} />,
    children: (
      <div style={{ display: 'grid', gap: 8 }}>
        <Text as="p">表示名: Yamaguchi</Text>
        <Text as="p">メール: sample@example.com</Text>
      </div>
    ),
  },
};

export const Mobile320WithLongAside: Story = {
  globals: {
    previewWidth: 'mobile320',
  },
  args: {
    title: '表示テーマ',
    description: 'ユーザー設定がシステム設定より優先されます。',
    aside: <Text as="span" variant="bodySm" tone="secondary">現在はライト表示です。</Text>,
    children: (
      <div style={{ display: 'grid', gap: 8 }}>
        <Text as="p">テーマ設定を変更すると、画面全体の配色に即時反映します。</Text>
        <Button label="設定を保存する" onPress={() => undefined} fullWidth />
      </div>
    ),
  },
};

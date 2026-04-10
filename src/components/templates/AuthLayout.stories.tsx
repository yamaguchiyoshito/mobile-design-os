import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button, FormField, Text } from '../ui';
import { AuthLayout } from './AuthLayout';

const meta: Meta<typeof AuthLayout> = {
  title: 'UI/Layout/AuthLayout',
  component: AuthLayout,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof AuthLayout>;

export const Default: Story = {
  args: {
    heading: (
      <div style={{ display: 'grid', gap: 8 }}>
        <Text as="h1" variant="headingMd">ログイン</Text>
        <Text as="p" variant="bodySm" tone="secondary">
          社内アカウントでサインインしてください。
        </Text>
      </div>
    ),
    body: (
      <div style={{ display: 'grid', gap: 12 }}>
        <FormField label="メールアドレス" value="" onChangeText={() => undefined} />
        <FormField label="パスワード" value="" type="password" onChangeText={() => undefined} />
        <Button label="ログインする" onPress={() => undefined} fullWidth />
      </div>
    ),
    footer: (
      <Text as="p" variant="bodySm" tone="secondary" align="center">
        パスワードを忘れた場合は管理者へ連絡してください。
      </Text>
    ),
  },
};

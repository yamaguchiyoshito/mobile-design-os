import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button, Card, FormField, Text } from '../ui';
import { MainLayout } from './MainLayout';

const meta: Meta<typeof MainLayout> = {
  title: 'UI/Layout/MainLayout',
  component: MainLayout,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof MainLayout>;

export const Default: Story = {
  args: {
    header: <Text as="h1" variant="headingMd">検索</Text>,
    body: (
      <div style={{ display: 'grid', gap: 16 }}>
        <FormField label="キーワード" value="" onChangeText={() => undefined} />
        <Card title="結果" description="検索結果のサマリー">
          <Text as="p">結果がここに表示されます。</Text>
        </Card>
      </div>
    ),
    footer: <Button label="検索する" onPress={() => undefined} fullWidth />,
  },
};

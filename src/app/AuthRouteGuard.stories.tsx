import type { Meta, StoryObj } from '@storybook/react-vite';

import { Text } from '../components/ui';
import { AuthRouteGuard } from './AuthRouteGuard';

const meta: Meta<typeof AuthRouteGuard> = {
  title: 'App/AuthRouteGuard',
  component: AuthRouteGuard,
};

export default meta;

type Story = StoryObj<typeof AuthRouteGuard>;

export const Guest: Story = {
  args: {
    isAuthenticated: false,
    children: <Text as="p">ログイン画面の内容</Text>,
  },
};

export const RedirectToMain: Story = {
  args: {
    isAuthenticated: true,
    fallback: <Text as="p">ホームへリダイレクトします</Text>,
    children: <Text as="p">ログイン画面の内容</Text>,
  },
};

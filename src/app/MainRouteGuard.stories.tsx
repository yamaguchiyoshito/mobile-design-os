import type { Meta, StoryObj } from '@storybook/react-vite';

import { Text } from '../components/ui';
import { MainRouteGuard } from './MainRouteGuard';

const meta: Meta<typeof MainRouteGuard> = {
  title: 'App/MainRouteGuard',
  component: MainRouteGuard,
};

export default meta;

type Story = StoryObj<typeof MainRouteGuard>;

export const Authenticated: Story = {
  args: {
    isAuthenticated: true,
    children: <Text as="p">メインアプリの内容</Text>,
  },
};

export const Guest: Story = {
  args: {
    isAuthenticated: false,
    fallback: <Text as="p">ログイン画面へリダイレクトします</Text>,
    children: <Text as="p">メインアプリの内容</Text>,
  },
};

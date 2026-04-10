import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { SearchBar } from './SearchBar';

const meta: Meta<typeof SearchBar> = {
  title: 'UI/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'centered',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);

    return (
      <div style={{ width: 420 }}>
        <SearchBar {...args} value={value} onChangeText={setValue} />
      </div>
    );
  },
};

export default meta;

type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {
  args: {
    value: '',
    placeholder: '商品名や注文番号で検索',
  },
};

export const Filled: Story = {
  args: {
    value: 'coffee',
    placeholder: '商品名や注文番号で検索',
  },
};

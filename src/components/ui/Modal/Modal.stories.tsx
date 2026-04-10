import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Button } from '../Button';
import { Text } from '../Text';
import { Modal } from './Modal';

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => {
    const [visible, setVisible] = useState(true);

    return (
      <div style={{ minHeight: '40vh' }}>
        {visible ? (
          <Modal {...args} visible={visible} onClose={() => setVisible(false)}>
            <div style={{ display: 'grid', gap: 12 }}>
              <Text as="h3" variant="headingMd">利用規約</Text>
              <Text as="p" variant="bodyMd" tone="secondary">
                この内容はモーダル内に表示されます。
              </Text>
              <Button label="同意する" onPress={() => setVisible(false)} />
            </div>
          </Modal>
        ) : (
          <Button label="開く" onPress={() => setVisible(true)} />
        )}
      </div>
    );
  },
};

export default meta;

type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  args: {
    visible: true,
    onClose: () => undefined,
    title: '利用規約',
    children: null,
  },
};

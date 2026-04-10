import type { Meta, StoryObj } from '@storybook/react-vite';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import spec from './mobile-design-os.openapi.json';

const meta = {
  title: 'Reference/API/Example OpenAPI',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'ローカルの OpenAPI JSON を `swagger-ui-react` で描画する Story。実運用ではこの JSON を生成物に差し替える。',
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <SwaggerUI
        spec={spec}
        docExpansion="list"
        displayRequestDuration
        filter
        supportedSubmitMethods={[]}
      />
    </div>
  ),
};

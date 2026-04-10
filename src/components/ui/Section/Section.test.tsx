import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { Section } from './Section';

describe('Section', () => {
  test('見出し付きの region として描画する', () => {
    const { getByRole } = render(
      <Section title="注文情報" description="配送先を確認してください。">
        <div>body</div>
      </Section>,
    );

    const region = getByRole('region', { name: '注文情報' });

    expect(region).toHaveAccessibleDescription('配送先を確認してください。');
  });
});

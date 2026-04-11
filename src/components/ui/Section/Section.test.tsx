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

  test('aside があっても header を折り返せる', () => {
    const { getByRole } = render(
      <Section
        title="表示テーマ"
        description="ユーザー設定がシステム設定より優先されます。"
        aside={<span>現在はライト表示です。</span>}
      >
        <div>body</div>
      </Section>,
    );

    const region = getByRole('region', { name: '表示テーマ' });
    const header = region.querySelector('header');

    expect(header).not.toBeNull();
    expect(header).toHaveStyle({
      flexWrap: 'wrap',
    });
  });
});

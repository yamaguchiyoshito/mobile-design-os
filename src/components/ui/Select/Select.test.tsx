import { fireEvent, render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { Select } from './Select';

const options = [
  { value: 'pickup', label: '店舗受取' },
  { value: 'delivery', label: '配送' },
];

describe('Select', () => {
  test('選択変更を通知する', () => {
    const onChange = vi.fn();
    const { getByRole } = render(
      <Select label="受取方法" value="" options={options} onChange={onChange} />,
    );

    fireEvent.change(getByRole('combobox', { name: '受取方法' }), {
      target: { value: 'delivery' },
    });

    expect(onChange).toHaveBeenCalledWith('delivery');
  });

  test('error があると alert を表示する', () => {
    const { getByRole } = render(
      <Select
        label="受取方法"
        value=""
        options={options}
        error="受取方法を選択してください"
        onChange={() => undefined}
      />,
    );

    expect(getByRole('alert')).toHaveTextContent('受取方法を選択してください');
  });
});

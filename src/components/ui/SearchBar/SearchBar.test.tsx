import { fireEvent, render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  test('入力変更を onChangeText に伝える', () => {
    const onChangeText = vi.fn();
    const { getByRole } = render(<SearchBar value="" onChangeText={onChangeText} />);

    fireEvent.change(getByRole('searchbox', { name: '検索' }), {
      target: { value: 'coffee' },
    });

    expect(onChangeText).toHaveBeenCalledWith('coffee');
  });

  test('入力済みならクリアボタンを表示する', () => {
    const onChangeText = vi.fn();
    const onClear = vi.fn();
    const { getByRole } = render(
      <SearchBar value="coffee" onChangeText={onChangeText} onClear={onClear} />,
    );

    fireEvent.click(getByRole('button', { name: '検索語をクリア' }));

    expect(onChangeText).toHaveBeenCalledWith('');
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});

import Search from '@shared/assets/search.svg?react';
import { useMemo, useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import './header-search.scss';
import { Input } from 'antd';
import { setSearchValue } from '@store/useAppStore';
import { debounce } from '@shared/helpers/helpers';

export const HeaderSearch = () => {
  const { t } = useTranslation('common');
  const [inputValue, setInputValue] = useState('');

  const debounceCallback = useMemo(() => debounce((value) => setSearchValue(value), 700), []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debounceCallback(value);
  };
  return (
    <div className="header-search">
      <Search />
      <Input value={inputValue} onChange={handleChange} placeholder={t('header.search-placeholder')} allowClear />
    </div>
  );
};

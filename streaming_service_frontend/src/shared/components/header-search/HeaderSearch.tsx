import Search from '@shared/assets/search.svg?react';
import { useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

import './header-search.scss';
import { Input } from 'antd';

export const HeaderSearch = () => {
  const { t } = useTranslation('common');
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  return (
    <div className="header-search">
      <Search />
      <Input value={inputValue} onChange={(e) => handleChange(e)} placeholder={t('header-placeholder')} allowClear />
    </div>
  );
};

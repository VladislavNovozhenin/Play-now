import logo from '@shared/assets/logo.png';

import { Link } from 'react-router-dom';
import Search from '@shared/assets/search.svg?react';

import './header.scss';
import { Grid } from 'antd';
import { HeaderSearch } from '@shared/components/header-search/HeaderSearch';
import { ProfileDropdown } from '@shared/components/profile-dropdown/ProfileDropdown';
import { useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';

const { useBreakpoint } = Grid;

export const Header = () => {
  const { md } = useBreakpoint();
  const [openSearch, setOpenSearch] = useState(false);

  return (
    <header className="header">
      {openSearch ? (
        <>
          <button className="header__close-search-btn" onClick={() => setOpenSearch(false)}>
            <CloseOutlined />
          </button>

          <HeaderSearch />
        </>
      ) : (
        <>
          <Link className="header__link" to={'/'}>
            <img src={logo} alt="logo" />
          </Link>
          <div className="header__right">
            {md ? (
              <HeaderSearch />
            ) : (
              <button onClick={() => setOpenSearch(true)} className="header__search-btn">
                <Search />
              </button>
            )}
            <ProfileDropdown />
          </div>
        </>
      )}
    </header>
  );
};

import { UserOutlined } from '@ant-design/icons';
import logo from '@shared/assets/logo.png';
import Search from '@shared/assets/search.svg?react';
import ChevronRight from '@shared/assets/chevron-right.svg?react';
import { Link } from 'react-router-dom';

import './header.scss';

export const Header = () => {
  return (
    <header className="header">
      <Link className="header__link" to={'/'}>
        <img src={logo} alt="logo" />
      </Link>

      <div className="header__search">
        <Search />
        <input type="text" />
      </div>

      <div className="header__profile">
        <UserOutlined />
        <span>ssxsxs</span>
        <ChevronRight />
      </div>
    </header>
  );
};

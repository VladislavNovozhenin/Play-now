import { Dropdown, Grid } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import ChevronRight from '@shared/assets/chevron-right.svg?react';
import './profile-dropdown.scss';
import { useTranslation } from 'react-i18next';
import { setTokenValue } from '@store/useAppStore';


const { useBreakpoint } = Grid;

export const ProfileDropdown = () => {
  const { md } = useBreakpoint();
  const { t } = useTranslation('common');

  const handleLogout = () => {
    setTokenValue(null);
  };

  const items = [
    {
      key: 'logout',
      label: t('logout'),
      danger: true,
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];
  return (
    <Dropdown className="profile-dropdown" trigger={['click']} menu={{ items }}>
      <button className="profile-dropdown__btn">
        <div className="profile-dropdown__info">
          <UserOutlined />
          <span>auth</span>
        </div>
        {md && <ChevronRight />}
      </button>
    </Dropdown>
  );
};

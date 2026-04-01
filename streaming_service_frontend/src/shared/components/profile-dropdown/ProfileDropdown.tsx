import { Dropdown, Grid } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import ChevronRight from '@shared/assets/chevron-right.svg?react';
import './profile-dropdown.scss';
import { useTranslation } from 'react-i18next';
import { setUserValue, useGetUser } from '@store/useAppStore';

const { useBreakpoint } = Grid;

export const ProfileDropdown = () => {
  const { md } = useBreakpoint();
  const { t } = useTranslation('common');
  const user = useGetUser();

  const handleLogout = () => {
    setUserValue(null);
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
    <Dropdown className="profile-dropdown" classNames={{root: 'profile-dropdown-root'}} trigger={['click']} menu={{ items }} placement="bottomRight">
      <button className="profile-dropdown__btn">
        <div className="profile-dropdown__info">
          <UserOutlined />
          <span>{user?.username}</span>
        </div>
        {md && <ChevronRight />}
      </button>
    </Dropdown>
  );
};

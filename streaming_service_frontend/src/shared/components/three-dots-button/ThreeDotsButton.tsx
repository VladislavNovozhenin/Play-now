import { Dropdown, type MenuProps } from 'antd';
import ThreeDots from '@shared/assets/three-dots.svg?react';
import './three-dots-button.scss';

type ThreeDotsButtonProps = {
  trackId: number;
  getMenuItems: (trackId: number) => MenuProps['items'];
};

const ThreeDotsButton = ({ trackId, getMenuItems }: ThreeDotsButtonProps) => {
  return (
    <Dropdown
      className="three-dots-button-dropdown"
      placement="bottomRight"
      trigger={['click']}
      menu={{ items: getMenuItems(trackId), style: { marginTop: 15 } }}
      classNames={{ root: 'three-dots-button-dropdown-root' }}>
      <button className="three-dots-dropdown__button">
        <ThreeDots />
      </button>
    </Dropdown>
  );
};

export default ThreeDotsButton;

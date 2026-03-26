import { Dropdown, type MenuProps } from 'antd';
import ThreeDots from '@shared/assets/three-dots.svg?react';
import { useEffect, useState } from 'react';

type ThreeDotsButtonProps = {
  menuItems: MenuProps['items'];
};

const ThreeDotsButton = ({ menuItems }: ThreeDotsButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);


  useEffect(() => {
    if (isOpen) {
      console.log('ddd');
    }
  }, [isOpen]);

  const handleOpenChange = (flag: boolean) => {
    setIsOpen(flag);
  };
  return (
    <Dropdown onOpenChange={handleOpenChange} trigger={['click']} menu={{ items: menuItems }}>
      <button>
        <ThreeDots />
      </button>
    </Dropdown>
  );
};

export default ThreeDotsButton;

import { Dropdown, type MenuProps } from 'antd';
import ThreeDots from '@shared/assets/three-dots.svg?react';
import { useMemo, useState } from 'react';
import type { IPlaylist } from '@shared/ts/types';
import { findTrackInPlaylists, isNullOrUndefined } from '@shared/common/helpers';

type ThreeDotsButtonProps = {
  trackId: number;
  allTracksPage?: boolean;
  playlists?: IPlaylist[];
};

const ThreeDotsButton = ({ trackId, allTracksPage, playlists }: ThreeDotsButtonProps) => {
  const [isMenuItemValue, setIsMenuItemValue] = useState<boolean | null>(true);

  const handleAddTrackToPlaylist = () => {};
  const handleRemoveTrackFromPlaylist = () => {};

  const menuItems = useMemo<MenuProps['items']>(() => {
    return [
      {
        key: isNullOrUndefined(isMenuItemValue) ? 'no-data' : isMenuItemValue ? 'remove' : 'add',
        label: isNullOrUndefined(isMenuItemValue) ? 'нет данных' : isMenuItemValue ? 'удалить' : 'добавить',
        onClick: isNullOrUndefined(isMenuItemValue) ? undefined : isMenuItemValue ? handleAddTrackToPlaylist : handleRemoveTrackFromPlaylist,
      },
    ];
  }, [isMenuItemValue]);

  const handleOpenChange = (open: boolean) => {
    if (allTracksPage && open) {
      const isTrackInPlaylists = playlists ? findTrackInPlaylists(playlists, trackId) : null;
      setIsMenuItemValue(isTrackInPlaylists);
    }
  };
  return (
    <Dropdown placement='bottomRight' onOpenChange={handleOpenChange} trigger={['click']} menu={{ items: menuItems }}>
      <button className='three-dots-button'>
        <ThreeDots />
      </button>
    </Dropdown>
  );
};

export default ThreeDotsButton;

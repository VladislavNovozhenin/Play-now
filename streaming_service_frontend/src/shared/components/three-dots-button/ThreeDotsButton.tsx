import { Dropdown, type MenuProps } from 'antd';
import ThreeDots from '@shared/assets/three-dots.svg?react';
import { useMemo, useState } from 'react';
import type { ModalState, Playlist } from '@shared/ts/types';
import { findTrackInPlaylists, isNullOrUndefined } from '@shared/common/helpers';
import { useTranslation } from 'react-i18next';
import './three-dots-button.scss';

type ThreeDotsButtonProps = {
  trackId: number;
  allTracksPage?: boolean;
  playlists?: Playlist[];
  openModal: (type: ModalState) => void;
};

const ThreeDotsButton = ({ trackId, allTracksPage, playlists, openModal }: ThreeDotsButtonProps) => {
  const [isMenuItemValue, setIsMenuItemValue] = useState<boolean | null>(true);
  const { t } = useTranslation('common');
  const handleAddTrackInPlaylist = () => {
    openModal({ type: 'add', trackId });
  };
  const handleRemoveTrackFromPlaylist = () => {
    openModal({ type: 'remove', trackId });
  };

  const menuItems = useMemo<MenuProps['items']>(() => {
    return [
      {
        key: isNullOrUndefined(isMenuItemValue) ? 'no-data' : isMenuItemValue ? 'remove' : 'add',
        label: isNullOrUndefined(isMenuItemValue) ? 'нет данных' : isMenuItemValue ? t('remove-from-playlist') : t('add-in-playlist'),
        onClick: isNullOrUndefined(isMenuItemValue) ? undefined : isMenuItemValue ? handleRemoveTrackFromPlaylist : handleAddTrackInPlaylist,
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
    <Dropdown
      className="three-dots-button-dropdown"
      placement="bottomRight"
      onOpenChange={handleOpenChange}
      trigger={['click']}
      menu={{ items: menuItems, style: { marginTop: 15 } }}
      classNames={{ root: 'three-dots-button-dropdown-root' }}>
      <button className="three-dots-dropdown__button">
        <ThreeDots />
      </button>
    </Dropdown>
  );
};

export default ThreeDotsButton;

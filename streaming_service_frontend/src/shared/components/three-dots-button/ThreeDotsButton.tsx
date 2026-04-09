import { Dropdown, type MenuProps } from 'antd';
import ThreeDots from '@shared/assets/three-dots.svg?react';
import { useMemo, useState } from 'react';
import type { ModalState } from '@shared/ts/types';
import { findTrackInPlaylists, isNullOrUndefined } from '@shared/common/helpers';
import { useTranslation } from 'react-i18next';
import './three-dots-button.scss';
import { UsePlaylistsList } from '@shared/hooks/usePlaylistsList';

type ThreeDotsButtonProps = {
  trackId: number | null;
  playlistPage?: boolean;
  openModal: (type: ModalState) => void;
  setTrackId: (value: number) => void;
};

type MenuState = {
  isFindOneTrack: boolean;
  findTracksValue: number;
} | null;

const ThreeDotsButton = ({ trackId, playlistPage, openModal, setTrackId }: ThreeDotsButtonProps) => {
  const { data: playlists } = UsePlaylistsList();
  const [menuItemValue, setMenuItemValue] = useState<MenuState>(null);
  const { t } = useTranslation('common');
  const handleAddTrackInPlaylist = () => {
    openModal('add');
    setTrackId(trackId!);
  };
  const handleRemoveTrackFromPlaylist = () => {
    openModal('remove');
    setTrackId(trackId!);
  };

  const menuItems = useMemo<MenuProps['items']>(() => {
    if (isNullOrUndefined(menuItemValue)) return [{ label: 'нет данных', key: 'no-data', disabled: true }];

    return [
      {
        label: t('add-in-playlist'),
        key: 'add',
        onClick: handleAddTrackInPlaylist,
        disabled: menuItemValue.isFindOneTrack && menuItemValue.findTracksValue === playlists?.length,
      },
      { label: t('remove-from-playlist'), key: 'remove', onClick: handleRemoveTrackFromPlaylist, disabled: !menuItemValue },
    ];
  }, [menuItemValue]);

  const handleOpenChange = (open: boolean) => {
    if (!playlistPage && open && !isNullOrUndefined(playlists) && !isNullOrUndefined(trackId)) {
      const { findLength } = findTrackInPlaylists(playlists, trackId);
      setMenuItemValue({ isFindOneTrack: findLength !== 0, findTracksValue: findLength });
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

import { useQuery } from '@tanstack/react-query';
import { Grid, type MenuProps } from 'antd';
import { TracksList } from '@shared/components/tracks-list/TracksList';
import type { LikesResponse, ModalState, Song } from '@shared/ts/types';
import { TracksTable } from '@shared/components/tracks-table/TracksTable';
import { useGetUser } from '@store/useAppStore';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { handleApiError } from '@shared/helpers/helpers';
import { useNotification } from '@shared/hooks/useNotification';
import { findTrackInPlaylists, isNullOrUndefined } from '@shared/common/helpers';
import { AddTrackModal } from '@shared/components/add-track-modal/AddTrackModal';
import { CreatePlaylistModal } from '@shared/components/create-playlist-modal/CreatePlaylistModal';
import { RemoveTrackModal } from '@shared/components/remove-track-modal/RemoveTrackModal';
import { USERS_QUERY_KEYS, usersAPI } from '@shared/api/users-api';
import { UsePlaylists } from '@shared/hooks/usePlaylists';

const { useBreakpoint } = Grid;
export const LikesTracksPage = () => {
  const { md, xl } = useBreakpoint();
  const user = useGetUser();
  const { t } = useTranslation('common');
  const { showError } = useNotification();
  const [modalType, setModalType] = useState<ModalState>(null);
  const [trackId, setTrackId] = useState<number | null>(null);
  const { data: playlists, error: playlistError } = UsePlaylists();
  const { data: likes, error: likesError } = useQuery<LikesResponse, Error, Song[]>({
    queryKey: [USERS_QUERY_KEYS.LIKES_LIST],
    queryFn: () => usersAPI.getLikesList(user!.username),
    select: (data) => data.songLikes,
    retry: false,
  });

  useEffect(() => {
    if (likesError) {
      handleApiError(likesError, showError, t, 'likesTracks');
    }
    if (playlistError) {
      handleApiError(playlistError, showError, t);
    }
    handleCloseModal();
  }, [likesError, playlistError]);

  const tracksInPlaylists = useMemo(() => {
    return findTrackInPlaylists(playlists);
  }, [playlists]);

  const getPlaylistsByTrack = useCallback(
    (trackId: number, include: boolean) => {
      return (playlists ?? []).filter((playlist) =>
        include ? tracksInPlaylists.get(trackId)?.has(playlist.id) : !tracksInPlaylists.get(trackId)?.has(playlist.id)
      );
    },
    [tracksInPlaylists]
  );

  const getMenuItems = useCallback(
    (trackId: number): MenuProps['items'] => {
      const trackCount = tracksInPlaylists.get(trackId)?.size ?? 0;

      if (isNullOrUndefined(playlists)) return [{ label: 'нет данных', key: 'no-data', disabled: true }];

      return [
        {
          label: t('tracks-table.add-in-playlist-btn'),
          key: 'add',
          onClick: () => {
            setTrackId(trackId);
            setModalType('add');
          },
          disabled: trackCount > 0 && playlists && trackCount === playlists?.length,
        },
        {
          label: t('tracks-table.remove-from-playlist-btn'),
          key: 'remove',
          onClick: () => {
            setTrackId(trackId);
            setModalType('remove');
          },
          disabled: trackCount === 0,
        },
      ];
    },
    [tracksInPlaylists, t]
  );

  const handleOpenModal = (type: ModalState) => {
    setModalType(type);
  };
  const handleCloseModal = () => {
    setModalType(null);
    setTrackId(null);
  };

  return (
    <>
      {md && <h1 className="title">{t('like-tracks-title')}</h1>}
      {xl ? (
        <TracksTable getMenuItems={getMenuItems} tableData={likes ?? []} isLikesPage />
      ) : (
        <TracksList getMenuItems={getMenuItems} listData={likes ?? []} />
      )}
      {modalType === 'add' && !isNullOrUndefined(trackId) && !isNullOrUndefined(playlists) && (
        <AddTrackModal
          getPlaylistsByTrack={getPlaylistsByTrack}
          isOpen={modalType === 'add'}
          onClose={handleCloseModal}
          openModal={handleOpenModal}
          trackId={trackId}
          playlists={playlists}
        />
      )}
      {modalType === 'remove' && !isNullOrUndefined(trackId) && !isNullOrUndefined(playlists) && (
        <RemoveTrackModal
          getPlaylistsByTrack={getPlaylistsByTrack}
          isOpen={modalType === 'remove'}
          onClose={handleCloseModal}
          trackId={trackId}
          playlists={playlists}
        />
      )}
      {modalType === 'createPlaylist' && !isNullOrUndefined(trackId) && !isNullOrUndefined(playlists) && (
        <CreatePlaylistModal isOpen={modalType === 'createPlaylist'} onClose={handleCloseModal} openModal={handleOpenModal} />
      )}
    </>
  );
};

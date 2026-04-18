import { useQuery } from '@tanstack/react-query';
import { Empty, Grid, type MenuProps } from 'antd';
import { TracksList } from '@shared/components/tracks-list/TracksList';
import type { AppError, LikesResponse, ModalState, Song } from '@shared/ts/types';
import { TracksTable } from '@shared/components/tracks-table/TracksTable';
import { useGetUser } from '@store/useAppStore';
import { useTranslation } from 'react-i18next';
import { useCallback, useMemo, useState } from 'react';
import { parseApiError } from '@shared/helpers/helpers';
import { findTrackInPlaylists, isNullOrUndefined } from '@shared/common/helpers';
import { AddTrackModal } from '@shared/components/add-track-modal/AddTrackModal';
import { CreatePlaylistModal } from '@shared/components/create-playlist-modal/CreatePlaylistModal';
import { RemoveTrackModalWithPlaylists } from '@shared/components/remove-track-modal-with-playlists/RemoveTrackModalWithPlaylists';
import { USERS_QUERY_KEYS, usersAPI } from '@shared/api/users-api';
import { UsePlaylists } from '@shared/hooks/usePlaylists';
import { ErrorData } from '@shared/components/error-data/ErrorData';
import { Loader } from '@shared/components/loader/Loader';

const { useBreakpoint } = Grid;
export const LikesTracksPage = () => {
  const { md, xl } = useBreakpoint();
  const user = useGetUser();
  const { t } = useTranslation('common');
  const [modalType, setModalType] = useState<ModalState>(null);
  const [trackId, setTrackId] = useState<number | null>(null);
  const { data: playlists, error: playlistError } = UsePlaylists();
  const {
    data: likes,
    error: likesError,
    refetch,
    isLoading,
  } = useQuery<LikesResponse, AppError, Song[]>({
    queryKey: [USERS_QUERY_KEYS.LIKES_LIST],
    queryFn: () => usersAPI.getLikesList(user!.username),
    select: (data) => data.songLikes,
    retry: false,
  });

  const likesErrorMessage = likesError ? parseApiError(likesError, t) : null;

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

      if (isNullOrUndefined(playlists) || playlistError) return [{ label: t('tracks-table.no-data'), key: 'no-data', disabled: true }];

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
    [tracksInPlaylists, t, playlistError]
  );

  const handleOpenModal = (type: ModalState) => {
    setModalType(type);
  };
  const handleCloseModal = () => {
    setModalType(null);
    setTrackId(null);
  };

  if (likesErrorMessage) return <ErrorData title={likesErrorMessage} btnTitle={t('errors.retry-btn')} onClick={refetch} />;

  if (likes?.length === 0) return <Empty description={t('empty')} />;

  if (isLoading) return <Loader />;

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
        <RemoveTrackModalWithPlaylists
          getPlaylistsByTrack={getPlaylistsByTrack}
          isOpen={modalType === 'remove'}
          onClose={handleCloseModal}
          trackId={trackId}
        />
      )}
      {modalType === 'createPlaylist' && !isNullOrUndefined(trackId) && !isNullOrUndefined(playlists) && (
        <CreatePlaylistModal isOpen={modalType === 'createPlaylist'} onClose={handleCloseModal} openModal={handleOpenModal} />
      )}
    </>
  );
};

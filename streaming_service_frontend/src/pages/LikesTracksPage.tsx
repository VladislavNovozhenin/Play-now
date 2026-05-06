import { Grid, type MenuProps } from 'antd';
import { TracksList } from '@shared/components/tracks-list/TracksList';
import type { TracksModalState } from '@shared/ts/types';
import { TracksTable } from '@shared/components/tracks-table/TracksTable';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { parseApiError } from '@shared/helpers/helpers';
import { findTrackInPlaylists, isIterableArray, isNullOrUndefined } from '@shared/common/helpers';
import { AddTrackModal } from '@shared/components/add-track-modal/AddTrackModal';
import { CreatePlaylistModal } from '@shared/components/create-playlist-modal/CreatePlaylistModal';
import { RemoveTrackModalWithPlaylists } from '@shared/components/remove-track-modal-with-playlists/RemoveTrackModalWithPlaylists';
import { usePlaylists } from '@shared/hooks/usePlaylists';
import { ErrorData } from '@shared/components/error-data/ErrorData';
import { Loader } from '@shared/components/loader/Loader';
import { useLikesTracks } from '@shared/hooks/useLikesTracks';
import { initPlayer, useSource } from '@store/playerStore';
import { useResolvedQueue } from '@shared/hooks/useResolvedQueue';

const { useBreakpoint } = Grid;
export const LikesTracksPage = () => {
  const { md, xl } = useBreakpoint();
  const { t } = useTranslation('common');
  const [modalType, setModalType] = useState<TracksModalState>(null);
  const [trackId, setTrackId] = useState<number | null>(null);
  const { data: playlists, error: playlistError } = usePlaylists();
  const { data: likes, error: likesError, refetch, isLoading } = useLikesTracks();
  const source = useSource();

  const queue = useResolvedQueue(source);

   useEffect(() => {
     if (isIterableArray(queue)) {
       initPlayer(queue);
     }
   }, [queue]);

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
          onClick: (info) => {
            info.domEvent.stopPropagation();
            setTrackId(trackId);
            setModalType('add');
          },
          disabled: trackCount > 0 && playlists && trackCount === playlists?.length,
        },
        {
          label: t('tracks-table.remove-from-playlist-btn'),
          key: 'remove',
          onClick: (info) => {
            info.domEvent.stopPropagation();
            setTrackId(trackId);
            setModalType('remove');
          },
          disabled: trackCount === 0,
        },
      ];
    },
    [tracksInPlaylists, t, playlistError]
  );

  const handleOpenModal = (type: TracksModalState) => {
    setModalType(type);
  };
  const handleCloseModal = () => {
    setModalType(null);
    setTrackId(null);
  };

  if (likesErrorMessage) return <ErrorData title={likesErrorMessage} btnTitle={t('errors.retry-btn')} onClick={refetch} />;

  if (isLoading) return <Loader />;

  return (
    <>
      {md && <h1 className="title">{t('like-tracks-title')}</h1>}
      {xl ? (
        <TracksTable getMenuItems={getMenuItems} tableData={likes ?? []} isLikesPage source={{ type: 'likes' }} />
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

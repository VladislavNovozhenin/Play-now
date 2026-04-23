import { parseApiError } from '@shared/helpers/helpers';
import { useTranslation } from 'react-i18next';
import { usePlaylists } from '@shared/hooks/usePlaylists';
import { Loader } from '@shared/components/loader/Loader';
import { ErrorData } from '@shared/components/error-data/ErrorData';
import { PlaylistsList } from '@shared/components/playlists-list/PlaylistsList';
import { useState } from 'react';
import { CreatePlaylistModal } from '@shared/components/create-playlist-modal/CreatePlaylistModal';
import type { PlaylistsModalState } from '@shared/ts/types';
import { RemovePlaylistModal } from '@shared/components/remove-playlist-modal/RemovePlaylistModal';
import { isNullOrUndefined } from '@shared/common/helpers';

export const PlaylistsPage = () => {
  const { t } = useTranslation('common');
  const { data: playlists, error: playlistsError, isLoading, refetch } = usePlaylists();
  const playlistsErrorMessage = playlistsError ? parseApiError(playlistsError, t) : null;
  const [modalType, setModalType] = useState<PlaylistsModalState>(null);
  const [playlistId, setPlaylistId] = useState<number | null>(null);

  const tooglePlaylistId = (id: number) => {
    setPlaylistId(id);
  };
  const handleCloseModal = () => {
    setModalType(null);
  };

  const handleOpenModal = (type: PlaylistsModalState) => {
    setModalType(type);
  };

  if (playlistsErrorMessage) return <ErrorData title={playlistsErrorMessage} btnTitle={t('errors.retry-btn')} onClick={refetch} />;
  if (isLoading) return <Loader />;

  return (
    <>
      <PlaylistsList playlists={playlists ?? []} openModal={handleOpenModal} tooglePlaylistId={tooglePlaylistId} />
      {modalType === 'add' && <CreatePlaylistModal isOpen={modalType === 'add'} onClose={handleCloseModal} />}
      {modalType === 'remove' && !isNullOrUndefined(playlistId) && (
        <RemovePlaylistModal isOpen={modalType === 'remove'} onClose={handleCloseModal} playlistId={playlistId} />
      )}
    </>
  );
};

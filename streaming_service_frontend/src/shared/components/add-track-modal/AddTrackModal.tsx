import { PLAYLISTS_QUERY_KEYS, playlistsAPI } from '@pages/playlists/api/api';
import { findTrackInPlaylists, isIterableArray, isNullOrUndefined } from '@shared/common/helpers';
import { handleApiError } from '@shared/helpers/helpers';
import { useNotification } from '@shared/hooks/useNotification';
import type { ApiError, ModalState, Playlist } from '@shared/ts/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type AddTrackModalProps = {
  onClose: () => void;
  isOpen: boolean;
  trackId: number;
  openModal: (type: ModalState) => void;
  playlists: Playlist[];
};
export const AddTrackModal = ({ onClose, isOpen, trackId, openModal, playlists }: AddTrackModalProps) => {
  const { playlistsWithoutTrack } = findTrackInPlaylists(playlists, trackId);
  const { t } = useTranslation('common');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null);
  const { showError, showSuccess } = useNotification();
  const queryClient = useQueryClient();

  const addTrackMutation = useMutation({
    mutationFn: ({ playlistId, songId }: { playlistId: number; songId: number }) => playlistsAPI.addTrackInPlaylist(playlistId, songId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [PLAYLISTS_QUERY_KEYS.PLAYLISTS_LIST] });
      showSuccess({ title: t('success') });
      onClose();
    },
    onError: (error: ApiError) => {
      handleApiError(error, showError, t);
    },
  });

  const handleChangePlaylistId = (id: number) => {
    if (selectedPlaylistId === id) {
      setSelectedPlaylistId(null);
    } else {
      setSelectedPlaylistId(id);
    }
  };

  const handleAddTrack = () => {
    if (!isNullOrUndefined(selectedPlaylistId) && !isNullOrUndefined(trackId)) {
      addTrackMutation.mutate({ playlistId: selectedPlaylistId, songId: trackId });
    }
  };

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} title={t('add-in-playlist')} mask>
      {isIterableArray(playlists) ? (
        <>
          <ul>
            {playlistsWithoutTrack.map((playlist) => {
              return (
                <li key={playlist.id}>
                  <button
                    style={{ backgroundColor: playlist.id === selectedPlaylistId ? 'grey' : 'transparent' }}
                    onClick={() => handleChangePlaylistId(playlist.id)}>
                    {playlist.name}
                  </button>
                </li>
              );
            })}
          </ul>
          <div>
            {!isNullOrUndefined(selectedPlaylistId) && <button onClick={handleAddTrack}>{t('add-btn')}</button>}
            <button onClick={onClose}>{t('cancel-btn')}</button>
          </div>
        </>
      ) : (
        <>
          <p>{t('add-track-modal.empty')}</p>
          <button onClick={() => openModal('createPlaylist')}>{t('add-track-modal.create-first-playlist')}</button>
          <button onClick={onClose}>{t('cancel-btn')}</button>
        </>
      )}
    </Modal>
  );
};

import { PLAYLISTS_QUERY_KEYS, playlistsAPI } from '@pages/playlists/api/api';
import { findTrackInPlaylists, isIterableArray, isNullOrUndefined } from '@shared/common/helpers';
import { handleApiError } from '@shared/helpers/helpers';
import { useNotification } from '@shared/hooks/useNotification';
import type { ApiError, ModalState, Playlist } from '@shared/ts/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './add-track-modal.scss';
import { PlaylistsListModal } from '../playlists-list-modal/PlaylistsListModal';

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
    <Modal className="add-track-modal" open={isOpen} onCancel={onClose} footer={null} title={t('add-in-playlist')} mask>
      <div className='add-track-modal__container'>
        {isIterableArray(playlists) ? (
          <>
            <PlaylistsListModal
              playlists={playlistsWithoutTrack}
              handleChangePlaylistId={handleChangePlaylistId}
              selectedPlaylistId={selectedPlaylistId}
            />
            <div className="add-track-modal__footer">
              {!isNullOrUndefined(selectedPlaylistId) && (
                <button className="add-track-modal__btn-add-track" onClick={handleAddTrack}>
                  {t('add-btn')}
                </button>
              )}
              <button className="add-track-modal__btn-cancel" onClick={onClose}>
                {t('cancel-btn')}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="add-track-modal__empty-descr">{t('add-track-modal.empty')}</p>
            <button className="add-track-modal__btn-add-playlist" onClick={() => openModal('createPlaylist')}>
              {t('add-track-modal.create-first-playlist')}
            </button>
            <button className="add-track-modal__btn-cancel" onClick={onClose}>
              {t('cancel-btn')}
            </button>
          </>
        )}
      </div>
    </Modal>
  );
};

import { playlistsAPI } from '@shared/api/playlists-api';
import { isNullOrUndefined } from '@shared/common/helpers';
import { handleApiError } from '@shared/helpers/helpers';
import { useNotification } from '@shared/hooks/useNotification';
import type { AppError, Playlist } from '@shared/ts/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlaylistsListModal } from '../playlists-list-modal/PlaylistsListModal';
import './remove-track-modal-with-playlists.scss';
import { USERS_QUERY_KEYS } from '@shared/api/users-api';

type RemoveTrackModalWithPlaylistsProps = {
  onClose: () => void;
  isOpen: boolean;
  trackId: number;
  getPlaylistsByTrack: (trackId: number, include: boolean) => Playlist[];
};
export const RemoveTrackModalWithPlaylists = ({ onClose, isOpen, trackId, getPlaylistsByTrack }: RemoveTrackModalWithPlaylistsProps) => {
  const { t } = useTranslation('common');
  const { showError, showSuccess } = useNotification();
  const queryClient = useQueryClient();
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null);

  const removeTrackMutation = useMutation({
    mutationFn: ({ playlistId, songId }: { playlistId: number; songId: number }) => playlistsAPI.removeTrackFromPlaylist(playlistId, songId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEYS.PLAYLISTS_LIST] });
      showSuccess({ title: t('success-notification.track-removed') });
      onClose();
    },
    onError: (error: AppError) => {
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

  const handleRemoveTrack = () => {
    if (!isNullOrUndefined(selectedPlaylistId) && !isNullOrUndefined(trackId)) {
      removeTrackMutation.mutate({ playlistId: selectedPlaylistId, songId: trackId });
    }
  };

  return (
    <Modal className="remove-track-modal-with-playlist" title={t('remove-track-modal.title')} open={isOpen} onCancel={onClose} footer={null} mask>
      <div className="remove-track-modal-with-playlist__container">
        <PlaylistsListModal
          playlists={getPlaylistsByTrack(trackId, true)}
          handleChangePlaylistId={handleChangePlaylistId}
          selectedPlaylistId={selectedPlaylistId}
        />
        <div className="remove-track-modal-with-playlist__footer">
          {!isNullOrUndefined(selectedPlaylistId) && (
            <button className="remove-track-modal-with-playlist__btn-remove-track" onClick={handleRemoveTrack}>
              {t('remove-track-modal.remove-btn')}
            </button>
          )}
          <button className="remove-track-modal-with-playlist__btn-cancel" onClick={onClose}>
            {t('remove-track-modal.cancel-btn')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

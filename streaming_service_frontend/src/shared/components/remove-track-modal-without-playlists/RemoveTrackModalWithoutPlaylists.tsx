import { PLAYLISTS_QUERY_KEYS, playlistsAPI } from '@shared/api/playlists-api';
import { handleApiError } from '@shared/helpers/helpers';
import { useNotification } from '@shared/hooks/useNotification';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import './remove-track-modal-without-playlists.scss';
import type { AppError } from '@shared/ts/types';

type RemoveTrackModalWithoutPlaylistsProps = {
  onClose: () => void;
  isOpen: boolean;
  trackId: number;
  playlistId: number;
};
export const RemoveTrackModalWithoutPlaylists = ({ onClose, isOpen, trackId, playlistId }: RemoveTrackModalWithoutPlaylistsProps) => {
  const { t } = useTranslation('common');
  const { showError, showSuccess } = useNotification();
  const queryClient = useQueryClient();

  const removeTrackMutation = useMutation({
    mutationFn: ({ playlistId, songId }: { playlistId: number; songId: number }) => playlistsAPI.removeTrackFromPlaylist(playlistId, songId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [PLAYLISTS_QUERY_KEYS.PLAYLIST] });
      showSuccess({ title: t('success-notification.track-removed') });
      onClose();
    },
    onError: (error: AppError) => {
      handleApiError(error, showError, t);
    },
  });

  const handleRemoveTrack = () => {
    removeTrackMutation.mutate({ playlistId, songId: trackId });
  };

  return (
    <Modal className="remove-track-modal-without-playlist" title={t('remove-track-modal.title')} open={isOpen} onCancel={onClose} footer={null} mask>
      <div className="remove-track-modal-without-playlist__footer">
        <button className="remove-track-modal-without-playlist__btn-remove-track" onClick={handleRemoveTrack}>
          {t('remove-track-modal.remove-btn')}
        </button>

        <button className="remove-track-modal-without-playlist__btn-cancel" onClick={onClose}>
          {t('remove-track-modal.cancel-btn')}
        </button>
      </div>
    </Modal>
  );
};

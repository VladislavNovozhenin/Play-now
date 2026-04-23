import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import './remove-playlist-modal.scss';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { playlistsAPI } from '@shared/api/playlists-api';
import { useNotification } from '@shared/hooks/useNotification';
import type { AppError } from '@shared/ts/types';
import { handleApiError } from '@shared/helpers/helpers';
import { USERS_QUERY_KEYS } from '@shared/api/users-api';

type RemovePlaylistModalProps = {
  isOpen: boolean;
  onClose: () => void;
  playlistId: number;
};
export const RemovePlaylistModal = ({ isOpen, onClose, playlistId }: RemovePlaylistModalProps) => {
  const { t } = useTranslation('common');
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotification();

  const removePlaylistMutation = useMutation({
    mutationFn: (playlistId: number) => playlistsAPI.removePlaylist(playlistId),
    onSuccess: async () => {
      showSuccess({ title: t('success-notification.remove-playlist') });
      await queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEYS.PLAYLISTS_LIST] });
      onClose();
    },
    onError: (error: AppError) => {
      handleApiError(error, showError, t);
    },
  });

  const handleRemovePlaylist = () => {
    removePlaylistMutation.mutate(playlistId);
  };
  return (
    <Modal className="remove-playlist-modal" title={t('remove-playlist-modal.title')} open={isOpen} onCancel={onClose} footer={null} mask>
      <div className="remove-playlist-modal__footer">
        <button onClick={handleRemovePlaylist} className="remove-playlist-modal__btn-remove">
          {t('remove-playlist-modal.remove-btn')}
        </button>

        <button className="remove-playlist-modal__btn-cancel" onClick={onClose}>
          {t('remove-playlist-modal.cancel-btn')}
        </button>
      </div>
    </Modal>
  );
};

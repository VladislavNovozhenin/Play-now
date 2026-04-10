import { PLAYLISTS_QUERY_KEYS, playlistsAPI } from '@pages/playlists/api/api';
import { findTrackInPlaylists, isNullOrUndefined } from '@shared/common/helpers';
import { handleApiError } from '@shared/helpers/helpers';
import { useNotification } from '@shared/hooks/useNotification';
import type { ApiError, Playlist } from '@shared/ts/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlaylistsListModal } from '../playlists-list-modal/PlaylistsListModal';
import './remove-track-modal.scss';

type RemoveTrackModalProps = {
  onClose: () => void;
  isOpen: boolean;
  trackId: number;
  playlists: Playlist[];
};
export const RemoveTrackModal = ({ onClose, isOpen, trackId, playlists }: RemoveTrackModalProps) => {
  const { playlistsWithTrack } = findTrackInPlaylists(playlists, trackId);
  const { t } = useTranslation('common');
  const { showError, showSuccess } = useNotification();
  const queryClient = useQueryClient();
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null);

  const removeTrackMutation = useMutation({
    mutationFn: ({ playlistId, songId }: { playlistId: number; songId: number }) => playlistsAPI.removeTrackFromPlaylist(playlistId, songId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [PLAYLISTS_QUERY_KEYS.PLAYLISTS_LIST] });
      showSuccess({ title: 'success' });
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

  const handleRemoveTrack = () => {
    if (!isNullOrUndefined(selectedPlaylistId) && !isNullOrUndefined(trackId)) {
      removeTrackMutation.mutate({ playlistId: selectedPlaylistId, songId: trackId });
    }
  };

  return (
    <Modal className="remove-track-modal" title={t('remove-from-playlist')} open={isOpen} onCancel={onClose} footer={null} mask>
      <PlaylistsListModal playlists={playlistsWithTrack} handleChangePlaylistId={handleChangePlaylistId} selectedPlaylistId={selectedPlaylistId} />
      <div className="remove-track-modal__footer">
        {!isNullOrUndefined(selectedPlaylistId) && (
          <button className="remove-track-modal__btn-remove-track" onClick={handleRemoveTrack}>
            {t('remove-btn')}
          </button>
        )}
        <button className="remove-track-modal__btn-cancel" onClick={onClose}>
          {t('cancel-btn')}
        </button>
      </div>
    </Modal>
  );
};

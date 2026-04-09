import { PLAYLISTS_QUERY_KEYS, playlistsAPI } from '@pages/playlists/api/api';
import { findTrackInPlaylists, isNullOrUndefined } from '@shared/common/helpers';
import { handleApiError } from '@shared/helpers/helpers';
import { useNotification } from '@shared/hooks/useNotification';
import type { ApiError, Playlist } from '@shared/ts/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type RemoveTrackModalProps = {
  onClose: () => void;
  isOpen: boolean;
  trackId: number;
  playlists: Playlist[];
};
export const RemoveTrackModal = ({ onClose, isOpen, trackId, playlists }: RemoveTrackModalProps) => {
  const { playlistsWithTrack } = findTrackInPlaylists(playlists, trackId);
  const { t } = useTranslation();
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
    <Modal title={t('remove-from-playlist')} open={isOpen} onCancel={onClose} footer={null} mask>
      <ul>
        {playlistsWithTrack.map((playlist) => {
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
        {!isNullOrUndefined(selectedPlaylistId) && <button onClick={handleRemoveTrack}>{t('delete-btn')}</button>}
        <button onClick={onClose}>{t('cancel-btn')}</button>
      </div>
    </Modal>
  );
};

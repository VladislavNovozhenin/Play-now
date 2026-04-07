import { PLAYLISTS_QUERY_KEYS, playlistsAPI } from '@pages/playlists/api/api';
import { handleApiError } from '@shared/helpers/helpers';
import { useNotification } from '@shared/hooks/useNotification';
import type { ApiError, ModalState } from '@shared/ts/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, Modal } from 'antd';
import { useTranslation } from 'react-i18next';

type CreatePlaylistModalProps = {
  onClose: () => void;
  isOpen: boolean;
  trackId: number;
  openModal: (type: ModalState) => void;
};
export const CreatePlaylistModal = ({ onClose, isOpen, trackId, openModal }: CreatePlaylistModalProps) => {
  const { t } = useTranslation('common');
  const [form] = Form.useForm<{ name: string }>();
  const { showError, showSuccess } = useNotification();
  const queryClient = useQueryClient();

  const createPlaylistMutation = useMutation({
    mutationFn: (name: string) => playlistsAPI.createPlaylist(name),
    onSuccess: async () => {
      showSuccess({ title: t('create-playlist-success') });
      await queryClient.invalidateQueries({ queryKey: [PLAYLISTS_QUERY_KEYS.PLAYLISTS_LIST] });
      openModal({ type: 'add', trackId });
    },
    onError: (error: ApiError) => {
      handleApiError(error, showError, t);
    },
  });

  const handleSumbit = () => {
    const value = form.getFieldsValue();
    createPlaylistMutation.mutate(value.name);
  };

  return (
    <Modal open={isOpen} onCancel={onClose} title={t('create-playlist-modal.create-playlist')} mask footer={null}>
      <Form form={form} onFinish={handleSumbit}>
        <Form.Item name='name'>
          <input placeholder={t('create-playlist-modal.enter-playlist-name')} />
        </Form.Item>
        <button type="submit">{t('create-playlist-modal.create-playlist')}</button>
      </Form>

      <button type="button" onClick={onClose}>
        {t('cancel-btn')}
      </button>
    </Modal>
  );
};

import { playlistsAPI } from '@shared/api/playlists-api';
import { handleApiError } from '@shared/helpers/helpers';
import { useNotification } from '@shared/hooks/useNotification';
import type { ApiError, ModalState } from '@shared/ts/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, Input, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import './create-playlist-modal.scss';
import { USERS_QUERY_KEYS } from '@shared/api/users-api';

type CreatePlaylistModalProps = {
  onClose: () => void;
  isOpen: boolean;
  openModal: (type: ModalState) => void;
};
export const CreatePlaylistModal = ({ onClose, isOpen, openModal }: CreatePlaylistModalProps) => {
  const { t } = useTranslation('common');
  const [form] = Form.useForm<{ name: string }>();
  const { showError, showSuccess } = useNotification();
  const queryClient = useQueryClient();

  const createPlaylistMutation = useMutation({
    mutationFn: (name: string) => playlistsAPI.createPlaylist(name),
    onSuccess: async () => {
      showSuccess({ title: t('success-notification.create-playlist') });
      await queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEYS.PLAYLISTS_LIST] });
      openModal('add');
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
    <Modal className="create-playlist-modal" open={isOpen} onCancel={onClose} title={t('create-playlist-modal.title')} mask footer={null}>
      <div className="create-playlist-modal__container">
        <Form form={form} onFinish={handleSumbit}>
          <Form.Item name="name">
            <Input placeholder={t('create-playlist-modal.enter-playlist-name')} />
          </Form.Item>
          <button className="create-playlist-modal__btn-create-playlist" type="submit">
            {t('create-playlist-modal.create-playlist-btn')}
          </button>
        </Form>

        <button className="create-playlist-modal__btn-cancel" type="button" onClick={onClose}>
          {t('create-playlist-modal.cancel-btn')}
        </button>
      </div>
    </Modal>
  );
};

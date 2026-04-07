import { isIterableArray } from '@shared/common/helpers';
import type { ModalState, Playlist } from '@shared/ts/types';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';

type AddTrackModalProps = {
  onClose: () => void;
  isOpen: boolean;
  playlists?: Playlist[];
  trackId: number;
  openModal: (type: ModalState) => void;
};
export const AddTrackModal = ({ onClose, isOpen, playlists, trackId, openModal }: AddTrackModalProps) => {
  const { t } = useTranslation('common');
  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} title={t('add-in-playlist')} mask>
      {isIterableArray(playlists) ? (
        <>
          <ul>
            {playlists?.map((playlist) => {
              return (
                <li key={playlist.id}>
                  <button>{playlist.name}</button>
                </li>
              );
            })}
          </ul>
          <div>
            <button>{t('add-btn')}</button>
            <button onClick={onClose}>{t('cancel-btn')}</button>
          </div>
        </>
      ) : (
        <>
          <p>{t('add-track-modal.empty')}</p>
          <button onClick={() => openModal({ type: 'createPlaylist', trackId })}>{t('add-track-modal.create-first-playlist')}</button>
          <button onClick={onClose}>{t('cancel-btn')}</button>
        </>
      )}
    </Modal>
  );
};

import { Modal } from 'antd';

type RemoveTrackModalProps = {
  onClose: () => void;
  isOpen: boolean;
  trackId: number;
};
export const RemoveTrackModal = ({ onClose, isOpen, trackId }: RemoveTrackModalProps) => {
  return <Modal open={isOpen} onCancel={onClose} />;
};

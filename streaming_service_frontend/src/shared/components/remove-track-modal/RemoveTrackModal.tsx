import { Modal } from 'antd';

type RemoveTrackModalProps = {
  open: boolean;
  onClose: () => void;
};
export const RemoveTrackModal = ({ open, onClose }: RemoveTrackModalProps) => {
  return <Modal open={open} onCancel={onClose} />;
};

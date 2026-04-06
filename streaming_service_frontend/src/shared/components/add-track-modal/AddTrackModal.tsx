import { Modal } from 'antd';

type AddTrackModalProps = {
  open: boolean;
  onClose: () => void;
};
export const AddTrackModal = ({ open, onClose }: AddTrackModalProps) => {
  return <Modal open={open} onCancel={onClose} />;
};

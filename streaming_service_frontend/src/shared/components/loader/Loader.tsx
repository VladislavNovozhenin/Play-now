import { Spin } from 'antd';
import './loader.scss';

export const Loader = () => {
  return (
    <div className="loader">
      <Spin />
    </div>
  );
};

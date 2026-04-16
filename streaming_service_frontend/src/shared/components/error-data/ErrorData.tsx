import { ExclamationCircleOutlined } from '@ant-design/icons';
import './error-data.scss';

type ErrorDataProps = {
  title: string;
  btnTitle: string;
  onClick: () => void;
};
export const ErrorData = ({ title, btnTitle, onClick }: ErrorDataProps) => {
  return (
    <div className="error-data">
      <div className="error-data__content">
        <p className="error-data__title">{title}</p>
        <ExclamationCircleOutlined/>
      </div>

      <button className="error-data__btn" onClick={onClick}>
        {btnTitle}
      </button>
    </div>
  );
};

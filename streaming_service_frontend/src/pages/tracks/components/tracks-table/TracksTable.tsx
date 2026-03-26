import type { IAlbum, ISong } from '@shared/ts/types';
import type { ColumnType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import Calendar from '@shared/assets/calendar.svg?react';
import Clock from '@shared/assets/clock.svg?react';
import Heart from '@shared/assets/heart.svg?react';
import Table from 'antd/es/table';
import { formatDate, formatMilliSecondsToMS, isIterableArray, isNullOrUndefined } from '@shared/common/helpers';
import { NO_DATA } from '@shared/common/constants';
import clsx from 'clsx';
import './tracks-table.scss';
import type { MenuProps } from 'antd';
import ThreeDotsButton from '@shared/components/three-dots-button/ThreeDotsButton';

type TracksTableProps = {
  tableData: ISong[];
};
export const TracksTable = ({ tableData }: TracksTableProps) => {
  const { t } = useTranslation('common');

  const menuItems: MenuProps['items'] = [
    {
      key: 'remove',
      label: 'удалить',
    },
    {
      key: 'add',
      label: 'добавить',
    },
  ];

  const colums: ColumnType<ISong>[] = [
    {
      title: '№',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      render: () => <span>1</span>,
    },
    {
      title: t('album'),
      dataIndex: 'album',
      key: 'album',
      render: (album: IAlbum) => <span>{album.name}</span>,
    },
    {
      title: <Calendar />,
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string | null) => <span>{isNullOrUndefined(createdAt) ? NO_DATA : formatDate(createdAt)}</span>,
    },

    {
      title: '',
      dataIndex: 'likes',
      key: 'likes',
      render: (likes: any[]) => {
        console.log(likes);
        return (
          <button>
            <Heart className={clsx(isIterableArray(likes) ? 'track-table__likes' : 'track-table__not-likes')} />
          </button>
        );
      },
    },
    {
      title: <Clock />,
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: number) => <span>{formatMilliSecondsToMS(duration)}</span>,
    },
    {
      title: '',
      dataIndex: 'actions',
      key: 'actions',
      render: () => <ThreeDotsButton menuItems={menuItems} />,
    },
  ];
  return <Table className="track-table" columns={colums} dataSource={tableData} />;
};

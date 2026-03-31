import type { IAlbum, ISong } from '@shared/ts/types';
import type { ColumnType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import Calendar from '@shared/assets/calendar.svg?react';
import Clock from '@shared/assets/clock.svg?react';
import Heart from '@shared/assets/heart.svg?react';
import Play from '@shared/assets/play.svg?react';
import Table from 'antd/es/table';
import { formatDate, formatMilliSecondsToMS, isIterableArray, isNullOrUndefined } from '@shared/common/helpers';
import { NO_DATA } from '@shared/common/constants';
import clsx from 'clsx';
import './tracks-table.scss';
import ThreeDotsButton from '@shared/components/three-dots-button/ThreeDotsButton';
import { UsePlaylistsList } from '@shared/hooks/usePlaylistsList';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect, useState } from 'react';
import { Spin } from 'antd';

type TracksTableProps = {
  tableData: ISong[];
};
export const TracksTable = ({ tableData }: TracksTableProps) => {
  const { t } = useTranslation('common');
  const { data } = UsePlaylistsList();
  const [visibleData, setVisibleData] = useState<ISong[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setVisibleData(tableData.slice(0, 9));
  }, [tableData.length]);

  const showMore = () => {
    if (loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleData((prev) => [...prev, ...tableData.slice(prev.length, prev.length + 9)]);
      setLoadingMore(false);
    }, 2000);
  };

  const colums: ColumnType<ISong>[] = [
    {
      title: '№',
      dataIndex: 'id',
      key: 'id',
      render: (id: number) => <span className="track-table__id">{id}</span>,
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      render: (_, track) => (
        <div className="track-table__name">
          <div className="track-table__name-img">
            <img src={track.image} alt="" />
            <Play />
          </div>

          <div className="track-table__name-content">
            <span>{track.name}</span>
            <span>{track.artist.name}</span>
          </div>
        </div>
      ),
    },
    {
      title: t('album'),
      dataIndex: 'album',
      key: 'album',
      render: (album: IAlbum) => <span className="track-table__album">{album.name}</span>,
    },
    {
      title: <Calendar />,
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string | null) => <span className="track-table__createdAt">{isNullOrUndefined(createdAt) ? NO_DATA : formatDate(createdAt)}</span>,
    },

    {
      title: '',
      dataIndex: 'likes',
      key: 'likes',
      render: (likes: any[]) => {
        return (
          <button className="track-table__likes">
            <Heart className={clsx(isIterableArray(likes) ? 'track-table__likes-svg' : 'track-table__likes-not-svg')} />
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
      render: (_, track) => <ThreeDotsButton trackId={track.id} allTracksPage playlists={data} />,
    },
  ];
  return (
    <InfiniteScroll
      loader={
        loadingMore ? (
          <div className="spin">
            <Spin />
          </div>
        ) : null
      }
      next={showMore}
      dataLength={visibleData.length}
      hasMore={visibleData.length < tableData.length}>
      <Table pagination={false} className="track-table" columns={colums} dataSource={visibleData} scroll={undefined} rowClassName="track-table__row" />
    </InfiniteScroll>
  );
};

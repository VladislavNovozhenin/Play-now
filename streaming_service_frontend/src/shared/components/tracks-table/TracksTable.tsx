import type { ColumnType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import Calendar from '@shared/assets/calendar.svg?react';
import Clock from '@shared/assets/clock.svg?react';
import Play from '@shared/assets/play.svg?react';
import Table from 'antd/es/table';
import { formatDate, formatMilliSecondsToMS, isIterableArray, isNullOrUndefined } from '@shared/common/helpers';
import { NO_DATA } from '@shared/common/constants';
import './tracks-table.scss';
import ThreeDotsButton from '@shared/components/three-dots-button/ThreeDotsButton';
import { UsePlaylistsList } from '@shared/hooks/usePlaylistsList';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect, useRef, useState } from 'react';
import { Spin } from 'antd';
import { useScrollToTopButton } from '@shared/hooks/useScrollToTopButton';
import { UpOutlined } from '@ant-design/icons';
import type { Song, Album, User } from '@shared/ts/types';

import { LikesButton } from '../likes-button/LikesButton';

type TracksTableProps = {
  tableData: Song[];
  isLikesPage?: boolean;
};
export const TracksTable = ({ tableData, isLikesPage }: TracksTableProps) => {
  const { t } = useTranslation('common');
  const { data } = UsePlaylistsList();
  const [visibleData, setVisibleData] = useState<Song[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const buttonToUp = useScrollToTopButton();
  const INITIAL_COUNT = 9;
  const minVisibleRef = useRef<number>(INITIAL_COUNT);

  const updateVisibleData = (trackId: number, newLikes: User[]) => {
    if (isLikesPage) {
      setVisibleData((prev) => prev.filter((track) => track.id !== trackId));
    } else {
      setVisibleData((prev) => prev.map((track) => (track.id === trackId ? { ...track, likes: newLikes } : track)));
    }
  };

  useEffect(() => {
    setVisibleData(tableData.slice(0, INITIAL_COUNT));
  }, [tableData]);

  useEffect(() => {
    const checkSizeWindow = () => {
      const windowHeight = window.innerHeight;
      const documentHeigth = document.documentElement.scrollHeight;
      if (windowHeight >= documentHeigth && visibleData.length < tableData.length && visibleData.length > minVisibleRef.current) {
        showMore();
      }
    };
    if (isIterableArray(visibleData)) {
      checkSizeWindow();
    }
    window.addEventListener('resize', checkSizeWindow);
    return () => window.removeEventListener('resize', checkSizeWindow);
  }, [visibleData]);

  const showMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleData((prev) => {
        const newVisibleValue = [...prev, ...tableData.slice(prev.length, prev.length + INITIAL_COUNT)];
        minVisibleRef.current = newVisibleValue.length;
        return newVisibleValue;
      });
      setLoadingMore(false);
    }, 1000);
  };

  const scrollToUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const colums: ColumnType<Song>[] = [
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
      render: (album: Album) => <span className="track-table__album">{album.name}</span>,
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
      render: (_, track) => {
        return <LikesButton updateVisibleData={updateVisibleData} track={track} />;
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
    <>
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
        hasMore={visibleData.length < tableData.length && visibleData.length >= minVisibleRef.current}>
        <Table rowKey="id" pagination={false} className="track-table" columns={colums} dataSource={visibleData} scroll={undefined} rowClassName="track-table__row" />
      </InfiniteScroll>
      {buttonToUp && (
        <button onClick={scrollToUp} className="track-table__button-up">
          <UpOutlined />
          <span>{t('up')}</span>
        </button>
      )}
    </>
  );
};

import type { ColumnType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import Calendar from '@shared/assets/calendar.svg?react';
import Clock from '@shared/assets/clock.svg?react';
import Play from '@shared/assets/play.svg?react';
import Table from 'antd/es/table';
import { formatDate, formatMilliSecondsToMS, isNullOrUndefined } from '@shared/common/helpers';
import { NO_DATA } from '@shared/common/constants';
import './tracks-table.scss';
import ThreeDotsButton from '@shared/components/three-dots-button/ThreeDotsButton';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Empty, Spin, type MenuProps } from 'antd';
import { useScrollToTopButton } from '@shared/hooks/useScrollToTopButton';
import { PauseOutlined, UpOutlined } from '@ant-design/icons';
import type { Song, Album, User } from '@shared/ts/types';

import { LikesButton } from '../likes-button/LikesButton';
import { useAutoLoadOnResize } from '@shared/hooks/useAutoLoadOnResize';
import { useGetSearchValue } from '@store/useAppStore';
import { playNewTrack, tooglePlay, useCurrentTrack, useIsPlaying } from '@store/playerStore';
import clsx from 'clsx';

type TracksTableProps = {
  tableData: Song[];
  getMenuItems: (trackId: number) => MenuProps['items'];
  isLikesPage?: boolean;
};
export const TracksTable = ({ tableData, getMenuItems, isLikesPage }: TracksTableProps) => {
  const { t } = useTranslation('common');

  const [visibleData, setVisibleData] = useState<Song[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const buttonToUp = useScrollToTopButton();
  const INITIAL_COUNT = 9;
  const minVisibleRef = useRef<number>(INITIAL_COUNT);
  const isShowMore = visibleData.length < tableData.length && visibleData.length >= minVisibleRef.current;
  const searchValue = useGetSearchValue();
  const isPlaying = useIsPlaying();
  const currentTrack = useCurrentTrack();

  useAutoLoadOnResize({ isShowMore, visibleData, showMore });

  const filterData = useMemo(
    () => tableData.filter((track) => track.name.toLowerCase().includes(searchValue.toLowerCase())),
    [tableData, searchValue]
  );

  const updateVisibleData = (trackId: number, newLikes: User[]) => {
    if (isLikesPage) {
      setVisibleData((prev) => prev.filter((track) => track.id !== trackId));
    } else {
      setVisibleData((prev) => prev.map((track) => (track.id === trackId ? { ...track, likes: newLikes } : track)));
    }
  };

  useEffect(() => {
    setVisibleData(filterData.slice(0, INITIAL_COUNT));
  }, [filterData]);

  function showMore() {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleData((prev) => {
        const newVisibleValue = [...prev, ...tableData.slice(prev.length, prev.length + INITIAL_COUNT)];
        minVisibleRef.current = newVisibleValue.length;
        return newVisibleValue;
      });
      setLoadingMore(false);
    }, 1000);
  }

  const scrollToUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRowClick = (track: Song) => {
    if (currentTrack?.id === track.id) {
      tooglePlay();
    } else {
      playNewTrack(track, tableData)
    }
  };

  const colums = useMemo<ColumnType<Song>[]>(
    () => [
      {
        title: '№',
        dataIndex: 'id',
        key: 'id',
        width: '50px',
        render: (id: number) => <span className="track-table__id">{id}</span>,
      },
      {
        title: t('tracks-table.name'),
        dataIndex: 'name',
        key: 'name',
        render: (_, track) => (
          <div className="track-table__name">
            <div className="track-table__name-img">
              <img src={track.image} alt="" />
              {isPlaying && currentTrack?.id === track.id ? <PauseOutlined /> : <Play />}
            </div>

            <div className="track-table__name-content">
              <span>{track.name}</span>
              <span>{track.artist.name}</span>
            </div>
          </div>
        ),
      },
      {
        title: t('tracks-table.album'),
        dataIndex: 'album',
        key: 'album',
        render: (album: Album) => <span className="track-table__album">{album.name}</span>,
      },
      {
        title: <Calendar />,
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (createdAt: string | null) => (
          <span className="track-table__createdAt">{isNullOrUndefined(createdAt) ? NO_DATA : formatDate(createdAt)}</span>
        ),
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
        render: (_, track) => <ThreeDotsButton getMenuItems={getMenuItems} trackId={track.id} />,
      },
    ],
    [getMenuItems, isPlaying, currentTrack]
  );

  if (!filterData.length) return <Empty description={t('empty')} />;

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
        hasMore={isShowMore}>
        <Table
          rowKey="id"
          pagination={false}
          className="track-table"
          columns={colums}
          dataSource={visibleData}
          scroll={undefined}
          rowClassName={(record) => clsx('track-table__row', record.id === currentTrack?.id && 'track-table__row-selected')}
          onRow={(record) => ({ onClick: () => handleRowClick(record) })}
        />
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

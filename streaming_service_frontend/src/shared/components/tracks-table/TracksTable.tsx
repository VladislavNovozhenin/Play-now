import type { IAlbum, ISong, IUser } from '@shared/ts/types';
import type { ColumnType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import Calendar from '@shared/assets/calendar.svg?react';
import Clock from '@shared/assets/clock.svg?react';
import Heart from '@shared/assets/heart.svg?react';
import Play from '@shared/assets/play.svg?react';
import Table from 'antd/es/table';
import { formatDate, formatMilliSecondsToMS, getLikeTracksByUsername, isIterableArray, isNullOrUndefined } from '@shared/common/helpers';
import { NO_DATA } from '@shared/common/constants';
import clsx from 'clsx';
import './tracks-table.scss';
import ThreeDotsButton from '@shared/components/three-dots-button/ThreeDotsButton';
import { UsePlaylistsList } from '@shared/hooks/usePlaylistsList';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TRACKS_QUERY_KEYS, tracksAPI } from '@pages/tracks/api/api';
import { useGetUser } from '@store/useAppStore';
import { useNotification } from '@shared/hooks/useNotification';
import { LIKES_QUERY_KEYS } from '@pages/likes-tracks/api/api';
import { useScrollToTopButton } from '@shared/hooks/useScrollToTopButton';
import { UpOutlined } from '@ant-design/icons';

type TracksTableProps = {
  tableData: ISong[];
};
export const TracksTable = ({ tableData }: TracksTableProps) => {
  const { t } = useTranslation('common');
  const { data } = UsePlaylistsList();
  const [visibleData, setVisibleData] = useState<ISong[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const queryClient = useQueryClient();
  const user = useGetUser();
  const { showSuccess } = useNotification();
  const buttonToUp = useScrollToTopButton();

  useEffect(() => {
    if (tableData.length) {
      setVisibleData(tableData.slice(0, 9));
    }
  }, [tableData]);

  useEffect(() => {
    const checkSizeWindow = () => {
      const windowHeight = window.innerHeight;
      const documentHeigth = document.documentElement.scrollHeight;
      if (windowHeight >= documentHeigth) {
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
    if (loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleData((prev) => [...prev, ...tableData.slice(prev.length, prev.length + 9)]);
      setLoadingMore(false);
    }, 2000);
  };

  const likeMutation = useMutation({
    mutationFn: (songId: number) => tracksAPI.likeSong(songId),
    onSuccess: async () => {
      showSuccess({ title: t('like-success') });
      await queryClient.invalidateQueries({ queryKey: [TRACKS_QUERY_KEYS.TRACKS_LIST] });
      await queryClient.invalidateQueries({ queryKey: [LIKES_QUERY_KEYS.LIKES_LIST] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const unLikeMutation = useMutation({
    mutationFn: (trackId: number) => tracksAPI.unLikeSong(trackId),
    onSuccess: async () => {
      showSuccess({ title: t('unlike-success') });
      await queryClient.invalidateQueries({ queryKey: [TRACKS_QUERY_KEYS.TRACKS_LIST] });
      await queryClient.invalidateQueries({ queryKey: [LIKES_QUERY_KEYS.LIKES_LIST] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleLikeOrUnLike = (track: ISong) => {
    if (isIterableArray(getLikeTracksByUsername(track.likes, user!.username))) {
      unLikeMutation.mutate(track.id);
    } else {
      likeMutation.mutate(track.id);
    }
  };

  const scrollToUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      render: (_, track) => {
        return (
          <button onClick={() => handleLikeOrUnLike(track)} className="track-table__likes">
            <Heart className={clsx(isIterableArray(getLikeTracksByUsername(track.likes, user!.username)) ? 'track-table__likes-svg' : 'track-table__likes-not-svg')} />
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
        hasMore={visibleData.length < tableData.length}>
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

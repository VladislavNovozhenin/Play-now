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
import { UsePlaylistsList } from '@shared/hooks/usePlaylistsList';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Spin } from 'antd';
import { useScrollToTopButton } from '@shared/hooks/useScrollToTopButton';
import { UpOutlined } from '@ant-design/icons';
import type { Song, Album, User, ModalState } from '@shared/ts/types';

import { LikesButton } from '../likes-button/LikesButton';
import { useAutoLoadOnResize } from '@shared/hooks/useAutoLoadOnResize';
import { AddTrackModal } from '../add-track-modal/AddTrackModal';
import { RemoveTrackModal } from '../remove-track-modal/RemoveTrackModal';
import { CreatePlaylistModal } from '../create-playlist-modal/CreatePlaylistModal';

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
  const isShowMore = visibleData.length < tableData.length && visibleData.length >= minVisibleRef.current;
  const [modalType, setModalType] = useState<ModalState>(null);

  const handleOpenModal = (type: ModalState) => {
    setModalType(type);
  };
  const handleCloseModal = () => setModalType(null);

  useAutoLoadOnResize({ isShowMore, visibleData, showMore });

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
        render: (_, track) => <ThreeDotsButton openModal={handleOpenModal} trackId={track.id} allTracksPage playlists={data} />,
      },
    ],
    [t, data]
  );
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
          rowClassName="track-table__row"
        />
      </InfiniteScroll>
      {buttonToUp && (
        <button onClick={scrollToUp} className="track-table__button-up">
          <UpOutlined />
          <span>{t('up')}</span>
        </button>
      )}
      {modalType?.type === 'add' && (
        <AddTrackModal
          playlists={data}
          isOpen={modalType.type === 'add'}
          onClose={handleCloseModal}
          openModal={handleOpenModal}
          trackId={modalType.trackId}
        />
      )}
      {modalType?.type === 'remove' && (
        <RemoveTrackModal isOpen={modalType.type === 'remove'} onClose={handleCloseModal} trackId={modalType.trackId} />
      )}
      {modalType?.type === 'createPlaylist' && (
        <CreatePlaylistModal
          isOpen={modalType.type === 'createPlaylist'}
          onClose={handleCloseModal}
          openModal={handleOpenModal}
          trackId={modalType.trackId}
        />
      )}
    </>
  );
};

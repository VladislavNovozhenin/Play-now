import type { ModalState, Song, User } from '@shared/ts/types';
import './tracks-list.scss';
import ThreeDotsButton from '@shared/components/three-dots-button/ThreeDotsButton';
import { UsePlaylistsList } from '@shared/hooks/usePlaylistsList';
import { Divider, Grid, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Fragment, useEffect, useRef, useState } from 'react';
import Play from '@shared/assets/play.svg?react';
import { useTranslation } from 'react-i18next';
import { useScrollToTopButton } from '@shared/hooks/useScrollToTopButton';
import { UpOutlined } from '@ant-design/icons';
import { LikesButton } from '../likes-button/LikesButton';
import { useAutoLoadOnResize } from '@shared/hooks/useAutoLoadOnResize';
import { AddTrackModal } from '../add-track-modal/AddTrackModal';
import { RemoveTrackModal } from '../remove-track-modal/RemoveTrackModal';
import { CreatePlaylistModal } from '../create-playlist-modal/CreatePlaylistModal';

type TracksListProps = {
  listData: Song[];
  isLikesPage?: boolean;
};

const { useBreakpoint } = Grid;
export const TracksList = ({ listData, isLikesPage }: TracksListProps) => {
  const { t } = useTranslation('common');
  const { data } = UsePlaylistsList();
  const [visibleData, setVisibleData] = useState<Song[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const { md } = useBreakpoint();
  const buttonToUp = useScrollToTopButton();
  const INITIAL_COUNT = md ? 18 : 12;
  const minVisibleRef = useRef<number>(INITIAL_COUNT);
  const isShowMore = visibleData.length < listData.length && visibleData.length >= minVisibleRef.current;
  const [isModalType, setIsModalType] = useState<ModalState>(null);

  const toogleModalType = (type: ModalState) => setIsModalType(type);

  useAutoLoadOnResize({ isShowMore, visibleData, showMore });

  const updateVisibleData = (trackId: number, newLikes: User[]) => {
    if (isLikesPage) {
      setVisibleData((prev) => prev.filter((track) => track.id !== trackId));
    } else {
      setVisibleData((prev) => prev.map((track) => (track.id === trackId ? { ...track, likes: newLikes } : track)));
    }
  };

  useEffect(() => {
    setVisibleData(listData.slice(0, INITIAL_COUNT));
  }, [listData]);

  function showMore() {
    if (loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleData((prev) => [...prev, ...listData.slice(prev.length, prev.length + INITIAL_COUNT)]);
      setLoadingMore(false);
    }, 2000);
  }

  const scrollToUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        hasMore={visibleData.length < listData.length}
        scrollableTarget="track-list-wrapper">
        <ul className="track-list">
          {visibleData.map((track, index) => {
            return (
              <Fragment key={track.id}>
                <li className="track-list__item">
                  <div className="track-list__left-content">
                    <div className="track-list__img">
                      <img src={track.image} alt="" />
                      <Play />
                    </div>
                    <div className="track-list__info">
                      <span>{track.name}</span>
                      <span>{track.artist.name}</span>
                    </div>
                  </div>

                  <div className="track-list__right-content">
                    <LikesButton updateVisibleData={updateVisibleData} track={track} />
                    <ThreeDotsButton openModal={toogleModalType} trackId={track.id} allTracksPage playlists={data} />
                  </div>
                </li>
                {index !== listData.length - 1 && <Divider />}
              </Fragment>
            );
          })}
        </ul>
      </InfiniteScroll>
      {buttonToUp && md && (
        <button onClick={scrollToUp} className="track-list__button-up">
          <UpOutlined />
          <span>{t('up')}</span>
        </button>
      )}
      {/* {isModalType === 'add' && <AddTrackModal isOpen={isModalType === 'add'} onClose={toogleModalType} />}
      {isModalType === 'remove' && <RemoveTrackModal isOpen={isModalType === 'remove'} onClose={toogleModalType} />}
      {isModalType === 'createPlaylist' && <CreatePlaylistModal isOpen={isModalType === 'createPlaylist'} onClose={toogleModalType} />} */}
    </>
  );
};

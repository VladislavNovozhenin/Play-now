import type { Song, User } from '@shared/ts/types';
import './tracks-list.scss';
import ThreeDotsButton from '@shared/components/three-dots-button/ThreeDotsButton';
import { isIterableArray } from '@shared/common/helpers';
import { UsePlaylistsList } from '@shared/hooks/usePlaylistsList';
import { Divider, Grid, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Fragment, useEffect, useState } from 'react';
import Play from '@shared/assets/play.svg?react';
import { useTranslation } from 'react-i18next';
import { useScrollToTopButton } from '@shared/hooks/useScrollToTopButton';
import { UpOutlined } from '@ant-design/icons';
import { LikesButton } from '../likes-button/LikesButton';

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

  const INITIAL_COUNT = md ? 15 : 10;

  const updateVisibleData = (trackId: number, newLikes: User[]) => {
    if (isLikesPage) {
      setVisibleData((prev) => prev.filter((track) => track.id !== trackId));
    } else {
      setVisibleData((prev) => prev.map((track) => (track.id === trackId ? { ...track, likes: newLikes } : track)));
    }
  };

  useEffect(() => {
    setVisibleData(listData.slice(0, 9));
  }, [listData]);

  useEffect(() => {
    const checkSizeWindow = () => {
      const windowHeight = window.innerHeight;
      const documentHeigth = document.documentElement.scrollHeight;
      if (windowHeight >= documentHeigth && visibleData.length < listData.length) {
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
      setVisibleData((prev) => [...prev, ...listData.slice(prev.length, prev.length + INITIAL_COUNT)]);
      setLoadingMore(false);
    }, 2000);
  };

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
                    <ThreeDotsButton trackId={track.id} allTracksPage playlists={data} />
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
    </>
  );
};

import type { ISong } from '@shared/ts/types';
import './tracks-list.scss';
import ThreeDotsButton from '@shared/components/three-dots-button/ThreeDotsButton';
import Heart from '@shared/assets/heart.svg?react';
import { getLikeTracksByUsername, isIterableArray } from '@shared/common/helpers';
import clsx from 'clsx';
import { UsePlaylistsList } from '@shared/hooks/usePlaylistsList';
import { Divider, Grid, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Fragment, useEffect, useState } from 'react';
import Play from '@shared/assets/play.svg?react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TRACKS_QUERY_KEYS, tracksAPI } from '@pages/tracks/api/api';
import { useNotification } from '@shared/hooks/useNotification';
import { useTranslation } from 'react-i18next';
import { useGetUser } from '@store/useAppStore';
import { LIKES_QUERY_KEYS } from '@pages/likes-tracks/api/api';
import { useScrollToTopButton } from '@shared/hooks/useScrollToTopButton';
import { UpOutlined } from '@ant-design/icons';

type TracksListProps = {
  listData: ISong[];
};

const { useBreakpoint } = Grid;
export const TracksList = ({ listData }: TracksListProps) => {
  const { t } = useTranslation('common');
  const { data } = UsePlaylistsList();
  const [visibleData, setVisibleData] = useState<ISong[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const queryClient = useQueryClient();
  const { showSuccess } = useNotification();
  const user = useGetUser();
  const { md } = useBreakpoint();
  const buttonToUp = useScrollToTopButton();

  const INITIAL_COUNT = md ? 15 : 10;

  useEffect(() => {
    setVisibleData(listData.slice(0, INITIAL_COUNT));
  }, [listData]);

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
      setVisibleData((prev) => [...prev, ...listData.slice(prev.length, prev.length + INITIAL_COUNT)]);
      setLoadingMore(false);
    }, 2000);
  };

  const likeMutation = useMutation({
    mutationFn: (trackId: number) => tracksAPI.likeSong(trackId),
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
    mutationFn: (songId: number) => tracksAPI.unLikeSong(songId),
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
                    <button onClick={() => handleLikeOrUnLike(track)} className="track-list__likes">
                      <Heart className={clsx(isIterableArray(getLikeTracksByUsername(track.likes, user!.username)) ? 'track-list__likes-svg' : 'track-list__likes-not-svg')} />
                    </button>
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

import type { ISong } from '@shared/ts/types';
import './track-list.scss';
import ThreeDotsButton from '@shared/components/three-dots-button/ThreeDotsButton';
import Heart from '@shared/assets/heart.svg?react';
import { isIterableArray } from '@shared/common/helpers';
import clsx from 'clsx';
import { UsePlaylistsList } from '@shared/hooks/usePlaylistsList';
import { Divider, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Fragment, useEffect, useState } from 'react';

type TrackListProps = {
  listData: ISong[];
};
export const TrackList = ({ listData }: TrackListProps) => {
  const { data } = UsePlaylistsList();
  const [visibleData, setVisibleData] = useState<ISong[]>([]);

  useEffect(() => {
    setVisibleData(listData.slice(0, 9));
  }, [listData.length]);

  const showMore = () => {
    setTimeout(() => {
      setVisibleData((prev) => [...prev, ...listData.slice(prev.length, prev.length + 9)]);
    }, 1000);
  };

  return (
    <div className="track-list-wrapper" id="track-list-wrapper">
      <InfiniteScroll
        loader={
          <div className="spin">
            <Spin />
          </div>
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
                    <img className="track-list__img" src={track.image} alt="" />
                    <div className="track-list__info">
                      <span>{track.name}</span>
                      <span>{track.artist.name}</span>
                    </div>
                  </div>

                  <div className="track-list__right-content">
                    <button className="track-list__likes">
                      <Heart className={clsx(isIterableArray(track.likes) ? 'track-list__likes-svg' : 'track-list__likes-not-svg')} />
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
    </div>
  );
};

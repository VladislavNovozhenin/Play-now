import { useQuery } from '@tanstack/react-query';
import type { ILikesDto } from './ts/types';
import { Grid } from 'antd';
import { LIKES_QUERY_KEYS, likesAPI } from './api/api';
import { TracksList } from '@shared/components/tracks-list/TracksList';
import type { ISong } from '@shared/ts/types';
import { TracksTable } from '@shared/components/tracks-table/TracksTable';

const { useBreakpoint } = Grid;
export const LikesSongsPage = () => {
  const { md, xl } = useBreakpoint();

  const { data, isLoading, isFetching } = useQuery<ILikesDto, Error, ISong[]>({
    queryKey: [LIKES_QUERY_KEYS.LIKES_LIST],
    queryFn: () => likesAPI.getLikesList(),
    select: (data) => data.songLikes,
    retry: false,
    refetchOnMount: false,
  });
  return (
    <>
      {md && <h1 className="title">Likes</h1>}
      {xl ? <TracksTable tableData={data ?? []} /> : <TracksList listData={data ?? []} />}
    </>
  );
};

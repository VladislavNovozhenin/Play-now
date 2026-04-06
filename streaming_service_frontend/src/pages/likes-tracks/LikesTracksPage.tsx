import { useQuery } from '@tanstack/react-query';
import { Grid } from 'antd';
import { LIKES_QUERY_KEYS, likesAPI } from './api/api';
import { TracksList } from '@shared/components/tracks-list/TracksList';
import type { Song } from '@shared/ts/types';
import { TracksTable } from '@shared/components/tracks-table/TracksTable';
import { useGetUser } from '@store/useAppStore';
import { useTranslation } from 'react-i18next';
import type { LikesResponse } from './ts/types';
import { useEffect } from 'react';
import { handleApiError } from '@shared/helpers/helpers';
import { useNotification } from '@shared/hooks/useNotification';

const { useBreakpoint } = Grid;
export const LikesTracksPage = () => {
  const { md, xl } = useBreakpoint();
  const user = useGetUser();
  const { t } = useTranslation('common');
  const { showError } = useNotification();

  const { data, error } = useQuery<LikesResponse, Error, Song[]>({
    queryKey: [LIKES_QUERY_KEYS.LIKES_LIST],
    queryFn: () => likesAPI.getLikesList(user!.username),
    select: (data) => data.songLikes,
    retry: false,
  });

  useEffect(() => {
    if (error) {
      handleApiError(error, showError, t, 'likesTracks');
    }
  }, [error]);

  return (
    <>
      {md && <h1 className="title">{t('like-songs')}</h1>}
      {xl ? <TracksTable tableData={data ?? []} isLikesPage /> : <TracksList listData={data ?? []} />}
    </>
  );
};

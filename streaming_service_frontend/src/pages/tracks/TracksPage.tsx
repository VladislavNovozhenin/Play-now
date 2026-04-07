import { useTranslation } from 'react-i18next';
import { TracksTable } from '../../shared/components/tracks-table/TracksTable';
import { useQuery } from '@tanstack/react-query';
import { TRACKS_QUERY_KEYS, tracksAPI } from './api/api';
import { Grid } from 'antd';
import { TracksList } from '@shared/components/tracks-list/TracksList';
import type { Song } from '@shared/ts/types';
import { useNotification } from '@shared/hooks/useNotification';
import { handleApiError } from '@shared/helpers/helpers';
import { useEffect } from 'react';

const { useBreakpoint } = Grid;
export const TracksPage = () => {
  const { t } = useTranslation('common');
  const { xl, md } = useBreakpoint();
  const { showError } = useNotification();

  const { data, error } = useQuery<Song[], unknown>({
    queryKey: [TRACKS_QUERY_KEYS.TRACKS_LIST],
    queryFn: () => tracksAPI.getTracksList(),
    retry: false,
  });

  useEffect(() => {
    if (error) {
      handleApiError(error, showError, t);
    }
  }, [error]);

  return (
    <>
      {md && <h1 className="title">{t('tracks')}</h1>}
      {xl ? <TracksTable tableData={data ?? []} /> : <TracksList listData={data ?? []} />}
    </>
  );
};

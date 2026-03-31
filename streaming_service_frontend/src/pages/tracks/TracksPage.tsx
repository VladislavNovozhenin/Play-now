import { useTranslation } from 'react-i18next';
import { TracksTable } from '../../shared/components/tracks-table/TracksTable';
import { useQuery } from '@tanstack/react-query';
import type { ISong } from '@shared/ts/types';
import { TRACKS_QUERY_KEYS, tracksAPI } from './api/api';
import { Grid } from 'antd';
import { TracksList } from '@shared/components/tracks-list/TracksList';

const { useBreakpoint } = Grid;
export const TracksPage = () => {
  const { t } = useTranslation('common');
  const { xl, md } = useBreakpoint();

  const { data, isLoading, isFetching } = useQuery<ISong[]>({
    queryKey: [TRACKS_QUERY_KEYS.TRACKS_LIST],
    queryFn: () => tracksAPI.getTracksList(),
    retry: false,
    refetchOnMount: false,
  });

  return (
    <>
      {md && <h1 className="title">{t('tracks')}</h1>}
      {xl ? <TracksTable tableData={data ?? []} /> : <TracksList listData={data ?? []} />}
    </>
  );
};

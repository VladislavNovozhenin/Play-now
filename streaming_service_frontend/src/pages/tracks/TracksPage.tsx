import { useTranslation } from 'react-i18next';
import { TracksTable } from './components/tracks-table/TracksTable';
import { useQuery } from '@tanstack/react-query';
import type { ISong } from '@shared/ts/types';
import { TRACKS_QUERY_KEYS, tracksAPI } from './api/api';

export const TracksPage = () => {
  const { t } = useTranslation('common');

  const { data, isLoading, isFetching } = useQuery<ISong[]>({
    queryKey: [TRACKS_QUERY_KEYS.TRACKS_LIST],
    queryFn: () => tracksAPI.getTracksList(),
    retry: false,
  });

  return (
    <>
      <h1 className="title">{t('tracks')}</h1>
      <TracksTable tableData={data || []} />
    </>
  );
};

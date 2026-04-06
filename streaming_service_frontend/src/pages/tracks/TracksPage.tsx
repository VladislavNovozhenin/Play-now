import { useTranslation } from 'react-i18next';
import { TracksTable } from '../../shared/components/tracks-table/TracksTable';
import { useQuery } from '@tanstack/react-query';
import { TRACKS_QUERY_KEYS, tracksAPI } from './api/api';
import { Grid } from 'antd';
import { TracksList } from '@shared/components/tracks-list/TracksList';
import type { Song } from '@shared/ts/types';
import { useNotification } from '@shared/hooks/useNotification';
import { handleApiError } from '@shared/helpers/helpers';
import { useEffect, useState } from 'react';
import { AddTrackModal } from '@shared/components/add-track-modal/AddTrackModal';
import { RemoveTrackModal } from '@shared/components/remove-track-modal/RemoveTrackModal';

const { useBreakpoint } = Grid;
export const TracksPage = () => {
  const { t } = useTranslation('common');
  const { xl, md } = useBreakpoint();
  const { showError } = useNotification();
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenRemoveModal, setIsOpenRemoveModal] = useState(false);

  const toogleAddModal = () => setIsOpenAddModal((prev) => !prev);
  const toogleRemoveModal = () => setIsOpenRemoveModal((prev) => !prev);

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
      {isOpenAddModal && <AddTrackModal open={isOpenAddModal} onClose={toogleAddModal} />}
      {isOpenRemoveModal && <RemoveTrackModal open={isOpenRemoveModal} onClose={toogleRemoveModal} />}
    </>
  );
};

import { parseApiError } from '@shared/helpers/helpers';
import { useTranslation } from 'react-i18next';
import { UsePlaylists } from '@shared/hooks/usePlaylists';
import { Loader } from '@shared/components/loader/Loader';
import { ErrorData } from '@shared/components/error-data/ErrorData';
import { PlaylistsList } from '@shared/components/playlists-list/PlaylistsList';

export const PlaylistsPage = () => {
  const { t } = useTranslation('common');
  const { data: playlists, error: playlistsError, isLoading, refetch } = UsePlaylists();
  const playlistsErrorMessage = playlistsError ? parseApiError(playlistsError, t) : null;

  if (playlistsErrorMessage) return <ErrorData title={playlistsErrorMessage} btnTitle={t('errors.retry-btn')} onClick={refetch} />;
  // if (tracks?.length === 0) return <Empty description={t('empty')} />;
  if (isLoading) return <Loader />;

  return (
    <>
      <PlaylistsList playlists={playlists ?? []} />
    </>
  );
};

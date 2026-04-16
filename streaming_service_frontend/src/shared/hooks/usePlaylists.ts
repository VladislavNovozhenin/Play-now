import { USERS_QUERY_KEYS, usersAPI } from '@shared/api/users-api';
import { isNullOrUndefined } from '@shared/common/helpers';
import type { AppError, Playlist } from '@shared/ts/types';
import { useGetUser } from '@store/useAppStore';
import { useQuery } from '@tanstack/react-query';

export const UsePlaylists = () => {
  const user = useGetUser();
  return useQuery<Playlist[], AppError>({
    queryKey: [USERS_QUERY_KEYS.PLAYLISTS_LIST, user?.username],
    queryFn: () => usersAPI.getPlaylists(user!.username),
    enabled: !isNullOrUndefined(user),
    retry: false,
  });
};

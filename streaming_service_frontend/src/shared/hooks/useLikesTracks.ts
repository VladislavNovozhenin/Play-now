import { USERS_QUERY_KEYS, usersAPI } from '@shared/api/users-api';
import type { AppError, LikesResponse, Song } from '@shared/ts/types';
import { useGetUser } from '@store/useAppStore';
import { useQuery } from '@tanstack/react-query';

export const useLikesTracks = (enabled: boolean = true) => {
  const user = useGetUser();
  return useQuery<LikesResponse, AppError, Song[]>({
    queryKey: [USERS_QUERY_KEYS.LIKES_LIST],
    queryFn: () => usersAPI.getLikesList(user!.username),
    select: (data) => data.songLikes,
    retry: false,
    enabled: enabled,
  });
};

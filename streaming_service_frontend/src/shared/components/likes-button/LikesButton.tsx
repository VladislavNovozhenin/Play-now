import { tracksAPI } from '@pages/tracks/api/api';
import Heart from '@shared/assets/heart.svg?react';
import { getLikeTracksByUsername, isIterableArray } from '@shared/common/helpers';
import { handleApiError } from '@shared/helpers/helpers';
import { useNotification } from '@shared/hooks/useNotification';
import type { ApiError, Song, User } from '@shared/ts/types';
import { useGetUser } from '@store/useAppStore';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import './likes-button.scss';

type LikesButtonProps = {
  track: Song;
  updateVisibleData: (trackId: number, newLikes: User[]) => void;
};
export const LikesButton = ({ track, updateVisibleData }: LikesButtonProps) => {
  const { t } = useTranslation('common');
  const user = useGetUser();
  const { showSuccess, showError } = useNotification();

  const isLiked = isIterableArray(getLikeTracksByUsername(track.likes, user!.username));

  const likeMutation = useMutation({
    mutationFn: (songId: number) => tracksAPI.likeSong(songId),
    onSuccess: async (response) => {
      showSuccess({ title: t('like-success') });
      updateVisibleData(track.id, response.likes);
    },
    onError: (error: unknown) => {
      handleApiError(error, showError, t, 'like');
    },
  });

  const unLikeMutation = useMutation({
    mutationFn: (trackId: number) => tracksAPI.unLikeSong(trackId),
    onSuccess: (response) => {
      showSuccess({ title: t('unlike-success') });
      updateVisibleData(track.id, response.likes);
    },
    onError: (error: ApiError) => {
      handleApiError(error, showError, t, 'unLike');
    },
  });

  const handleLikeOrUnLike = (track: Song) => {
    if (isLiked) {
      unLikeMutation.mutate(track.id);
    } else {
      likeMutation.mutate(track.id);
    }
  };
  return (
    <button onClick={() => handleLikeOrUnLike(track)} className="likes-btn">
      <Heart className={clsx(isLiked ? 'likes-btn__like' : 'likes-btn__unlike')} />
    </button>
  );
};

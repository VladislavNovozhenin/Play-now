import { tracksAPI } from '@shared/api/tracks-api';
import Heart from '@shared/assets/heart.svg?react';
import { getLikeTracksByUsername, isIterableArray } from '@shared/common/helpers';
import { handleApiError } from '@shared/helpers/helpers';
import { useNotification } from '@shared/hooks/useNotification';
import type { AppError, Song, User } from '@shared/ts/types';
import { useGetUser } from '@store/useAppStore';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import './likes-button.scss';
import type React from 'react';

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
    mutationFn: (songId: number) => tracksAPI.likeTrack(songId),
    onSuccess: async (response) => {
      showSuccess({ title: t('success-notification.like') });
      updateVisibleData(track.id, response.likes);
    },
    onError: (error: AppError) => {
      handleApiError(error, showError, t);
    },
  });

  const unLikeMutation = useMutation({
    mutationFn: (trackId: number) => tracksAPI.unlikeTrack(trackId),
    onSuccess: (response) => {
      showSuccess({ title: t('success-notification.unlike') });
      updateVisibleData(track.id, response.likes);
    },
    onError: (error: AppError) => {
      handleApiError(error, showError, t);
    },
  });

  const handleLikeOrUnLike = (track: Song, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isLiked) {
      unLikeMutation.mutate(track.id);
    } else {
      likeMutation.mutate(track.id);
    }
  };
  return (
    <button onClick={(e) => handleLikeOrUnLike(track, e)} className="likes-btn">
      <Heart className={clsx(isLiked ? 'likes-btn__like' : 'likes-btn__unlike')} />
    </button>
  );
};

import { audioPause, audioPlay, audioSetSrc, audioSetVolume, getAudio } from '@shared/components/player/player-engine';
import { getTrackUrl } from '@shared/helpers/helpers';
import {
  useIsPlaying,
  useCurrentTrack,
  useVolume,
  nextTrack,
  setDuration,
  setCurrentTime,
  useRepeatMode,
  playerStore,
  useDuration,
  useCurrentTime,
} from '@store/playerStore';
import React, { useEffect } from 'react';

type UsePlayerProps = {
  isPullingRef: React.RefObject<boolean>;
};
export const usePlayer = ({ isPullingRef }: UsePlayerProps) => {
  const isPlaying = useIsPlaying();
  const currentTrack = useCurrentTrack();
  const currentTime = useCurrentTime();
  const volume = useVolume();
  const duration = useDuration();
  const audio = getAudio();

  useEffect(() => {
    const onEnded = () => {
      const { repeatMode } = playerStore.getState();
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        setCurrentTime(0);
        audioPlay();
      } else {
        nextTrack();
      }
    };

    audio.addEventListener('ended', onEnded);
    return () => audio.removeEventListener('ended', onEnded);
  }, []);

  useEffect(() => {
    audioSetVolume(volume);
  }, [volume]);

  useEffect(() => {
    if (!currentTrack) return;
    const src = getTrackUrl(currentTrack);
    audioSetSrc(src);
    if (isPlaying) {
      if (currentTime === duration) {
        audio.currentTime = 0;
        setCurrentTime(0);
      }
      audioPlay();
    } else {
      audioPause();
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    const onTimeUpdate = () => {
      if (!isPullingRef.current) {
        setCurrentTime(audio.currentTime);
      }
    };
    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [currentTrack]);
};

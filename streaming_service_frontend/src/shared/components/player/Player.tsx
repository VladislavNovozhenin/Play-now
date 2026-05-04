import { PlayerActions } from '../player-actions/PlayerActions';
import Speaker from '@shared/assets/speaker.svg?react';
import './player.scss';
import { Slider } from 'antd';
import { setCurrentTime, setVolume, useCurrentTime, useDuration, useVolume } from '@store/playerStore';

import { usePlayer } from '@shared/hooks/usePlayer';
import { getAudio } from './player-engine';
import { useRef } from 'react';
import { formatTime } from '@shared/helpers/helpers';

export const Player = () => {
  const volume = useVolume();
  const currentTime = useCurrentTime();
  const duration = useDuration();
  const audio = getAudio();
  const isPullingRef = useRef<boolean>(false);

  usePlayer({ isPullingRef });

  const handleVolumeChange = (value: number) => {
    setVolume(value);
  };

  const handleCurrentTimeChange = (value: number) => {
    isPullingRef.current = true;
    setCurrentTime(value);
  };

  const handleCurrentTimeChangeComplete = (value: number) => {
    isPullingRef.current = false;
    audio.currentTime = value;
  };

  return (
    <div className="player">
      <div className="player__info">
        <img src="" alt="" />
        <div>
          <div>
            <span></span>
          </div>
          <span></span>
        </div>
      </div>

      <div className="player__center">
        <PlayerActions />
        <div className="player__time">
          <span>{formatTime(audio.currentTime)}</span>
          <Slider
            step={0.1}
            min={0}
            max={duration ?? 0}
            value={currentTime}
            className="player__slider-time"
            onChange={handleCurrentTimeChange}
            onChangeComplete={handleCurrentTimeChangeComplete}
          />
          <span>{formatTime(audio.duration)}</span>
        </div>
      </div>

      <div className="player__speaker">
        <Speaker />
        <Slider
          className="player__slider-speaker"
          step={0.01}
          value={volume}
          onChange={handleVolumeChange}
          max={1}
          min={0}
          tooltip={{ open: false }}
        />
      </div>
    </div>
  );
};

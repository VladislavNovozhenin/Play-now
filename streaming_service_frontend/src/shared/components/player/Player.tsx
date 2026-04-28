import { useEffect, useRef} from 'react';
import { PlayerActions } from '../player-actions/PlayerActions';
import Speaker from '@shared/assets/speaker.svg?react';
import './player.scss';
import { Slider } from 'antd';
import { NO_DATA } from '@shared/common/constants';
import { setVolume, useCurrentTrack, useIsPlaying, useVolume } from '@store/playerStore';
import { getTrackUrl } from '@shared/helpers/helpers';

export const Player = () => {
  const audioRef = useRef<HTMLAudioElement | null>(new Audio());
  const isPlaying = useIsPlaying();
  const currentTrack = useCurrentTrack();
  const volume = useVolume()

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = getTrackUrl(currentTrack);
      audioRef.current.volume = volume;
    }
  }, [audioRef.current, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (!(audioRef.current && currentTrack)) return;
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);

  const handleVolumeChange = (value: number) => {
    setVolume(value);
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
        <PlayerActions/>
        <div className="player__time">
          <span>{NO_DATA}</span>
          <Slider className="player__slider-time" />
          <span>{NO_DATA}</span>
        </div>
      </div>

      <div className="player__speaker">
        <Speaker />
        <Slider className="player__slider-speaker" step={0.01} value={volume} onChange={handleVolumeChange} max={1} min={0} tooltip={{open: false}}/>
      </div>
    </div>
  );
};

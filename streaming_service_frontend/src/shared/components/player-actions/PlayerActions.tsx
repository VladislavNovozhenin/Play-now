import { PauseOutlined } from '@ant-design/icons';
import './player-actions.scss';
import Play from '@shared/assets/play.svg?react';
import Repeat from '@shared/assets/repeat.svg?react';
import Shuffle from '@shared/assets/shuffle.svg?react';
import Back from '@shared/assets/skip-back.svg?react';
import Forward from '@shared/assets/skip-forward.svg?react';
import { nextTrack, prevTrack, setRepeatMode, togglePlay, useIsPlaying, useRepeatMode } from '@store/playerStore';
import clsx from 'clsx';

type PlayerActionsProps = {};
export const PlayerActions = ({}: PlayerActionsProps) => {
  const isPlaying = useIsPlaying();
  const repeatMode = useRepeatMode();
  return (
    <div className="player-actions">
      <button>
        <Shuffle />
      </button>
      <button onClick={prevTrack}>
        <Back />
      </button>
      <button onClick={togglePlay} className="player-actions__play">
        {isPlaying ? <PauseOutlined /> : <Play />}
      </button>
      <button onClick={nextTrack}>
        <Forward />
      </button>
      <button onClick={setRepeatMode} className={clsx('player-actions__repeat', repeatMode === 'one' && 'one', repeatMode === 'all' && 'all')}>
        <Repeat />
        <span>1</span>
      </button>
    </div>
  );
};

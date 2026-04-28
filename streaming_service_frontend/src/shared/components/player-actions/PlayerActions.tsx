import { PauseOutlined } from '@ant-design/icons';
import './player-actions.scss';
import Play from '@shared/assets/play.svg?react';
import Repeat from '@shared/assets/repeat.svg?react';
import Shuffle from '@shared/assets/shuffle.svg?react';
import Back from '@shared/assets/skip-back.svg?react';
import Forward from '@shared/assets/skip-forward.svg?react';
import { tooglePlay, useIsPlaying } from '@store/playerStore';

type PlayerActionsProps = {};
export const PlayerActions = ({}: PlayerActionsProps) => {
  const isPlaying = useIsPlaying();
  return (
    <div className="player-actions">
      <button>
        <Shuffle />
      </button>
      <button>
        <Back />
      </button>
      <button onClick={() => tooglePlay()} className="player-actions__play">
        {isPlaying ? <PauseOutlined /> : <Play />}
      </button>
      <button>
        <Forward />
      </button>
      <button>
        <Repeat />
      </button>
    </div>
  );
};

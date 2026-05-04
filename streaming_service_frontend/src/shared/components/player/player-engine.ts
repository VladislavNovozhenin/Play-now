const audio = new Audio();
audio.preload = 'metadata';

export const getAudio = () => audio;

export const audioPause = () => {
  audio.pause();
};

export const audioPlay = () => {
  audio.play().catch((e) => {
    console.log(e);
  });
};

export const audioSetSrc = (src: string) => {
  if (audio.src !== src) {
    audio.src = src;
  }
};

export const audioSetVolume = (volume: number) => {
  audio.volume = volume;
};

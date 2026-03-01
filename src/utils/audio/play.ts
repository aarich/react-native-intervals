import { AudioPlayer, createAudioPlayer } from 'expo-audio';

import { AudioInfo } from './library';

export const load = (audioInfo: AudioInfo) => createAudioPlayer(audioInfo.file);

export const play = (
  audioInfo: AudioInfo,
  options?: { isLooping?: boolean; positionMillis?: number },
): AudioPlayer => {
  const player = load(audioInfo);
  if (options?.isLooping) {
    player.loop = true;
  }
  if (options?.positionMillis) {
    player.seekTo(options.positionMillis / 1000);
  }
  player.play();
  return player;
};

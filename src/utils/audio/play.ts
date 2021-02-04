import { AVPlaybackStatusToSet, Audio } from 'expo-av';

import { AudioInfo } from './library';

export const load = (audioInfo: AudioInfo, status?: AVPlaybackStatusToSet) =>
  Audio.Sound.createAsync(audioInfo.file, status);

export const play = (audioInfo: AudioInfo, status?: AVPlaybackStatusToSet) =>
  load(audioInfo, status).then(({ sound }) => {
    return sound.playAsync().then(() => sound);
  });

export const unload = (sound: Audio.Sound) => {
  return sound && sound.unloadAsync();
};

export const playAndUnload = (audioInfo: AudioInfo) =>
  play(audioInfo).then(unload);

import { AVPlaybackSource } from 'expo-av/build/AV';

export type AudioInfo = {
  file: AVPlaybackSource;
  name: string;
  id: number;
};

export const AUDIO_FILES: AudioInfo[] = [
  {
    file: require('../../../assets/audio/alarm-clock-90867.mp3'),
    name: 'Beeps',
    id: 12,
  },
  {
    file: require('../../../assets/audio/ringtone-89218.mp3'),
    name: 'Ringtone',
    id: 13,
  },
  {
    file: require('../../../assets/audio/ringtone2-39981.mp3'),
    name: 'Phone Call',
    id: 14,
  },
  {
    file: require('../../../assets/audio/sleigh_bells-99843.mp3'),
    name: 'Sleigh Bells',
    id: 15,
  },
  {
    file: require('../../../assets/audio/applauses-356.mp3'),
    name: 'Applause',
    id: 0,
  },
  {
    file: require('../../../assets/audio/cuckoo-cuckoo-clock-428.mp3'),
    name: 'Cuckoo Clock',
    id: 1,
  },
  {
    file: require('../../../assets/audio/discreet-492.mp3'),
    name: 'Discreet',
    id: 2,
  },
  {
    file: require('../../../assets/audio/theres-a-fire-somewhere-87.mp3'),
    name: 'Fire Alarm',
    id: 3,
  },
  {
    file: require('../../../assets/audio/good-morning-502.mp3'),
    name: 'Good Morning',
    id: 4,
  },
  {
    file: require('../../../assets/audio/man-laughing-393.mp3'),
    name: 'Laughter',
    id: 5,
  },
  {
    file: require('../../../assets/audio/old-taxi-horn-2-33.mp3'),
    name: 'Old Taxi Horn',
    id: 6,
  },
  {
    file: require('../../../assets/audio/open-your-eyes-and-see-323.mp3'),
    name: 'Open Your Eyes',
    id: 7,
  },
  {
    file: require('../../../assets/audio/quest-605.mp3'),
    name: 'Quest',
    id: 8,
  },
  {
    file: require('../../../assets/audio/rush-532.mp3'),
    name: 'Rush',
    id: 9,
  },
  {
    file: require('../../../assets/audio/siren-air-raid-205.mp3'),
    name: 'Siren',
    id: 10,
  },
  {
    file: require('../../../assets/audio/vuvuzela-power-down-126.mp3'),
    name: 'Vuvuzela',
    id: 11,
  },
].sort((a, b) => (a.name < b.name ? -1 : 1));

const AUDIO_LOOKUP = AUDIO_FILES.reduce<Record<number, AudioInfo>>(
  (prev, curr) => ({ ...prev, [curr.id]: curr }),
  {}
);

export const getAudioInfo = (audioId: number): AudioInfo => {
  const audioInfo = AUDIO_LOOKUP[audioId];
  if (!audioInfo) {
    throw new Error(`Audio File ${audioId} not found`);
  }

  return audioInfo;
};

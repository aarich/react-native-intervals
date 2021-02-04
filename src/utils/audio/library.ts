import { AVPlaybackSource } from 'expo-av/build/AV';

// https://notificationsounds.com/wake-up-tones/alarm-frenzy-493
export type AudioInfo = {
  file: AVPlaybackSource;
  name: string;
};

export const AUDIO_FILES: AudioInfo[] = [
  {
    file: require('../../../assets/audio/open-your-eyes-and-see-323.mp3'),
    name: 'Open Your Eyes',
  },
  {
    file: require('../../../assets/audio/alarm-frenzy-493.mp3'),
    name: 'Alarm Frenzy',
  },
  {
    file: require('../../../assets/audio/discreet-492.mp3'),
    name: 'Discreet',
  },
  {
    file: require('../../../assets/audio/good-morning-502.mp3'),
    name: 'Good Morning',
  },
  {
    file: require('../../../assets/audio/old-taxi-horn-2-33.mp3'),
    name: 'Old Taxi Horn',
  },

  {
    file: require('../../../assets/audio/man-laughing-393.mp3'),
    name: 'Laughter',
  },
  {
    file: require('../../../assets/audio/applauses-356.mp3'),
    name: 'Applause',
  },
  {
    file: require('../../../assets/audio/vuvuzela-power-down-126.mp3'),
    name: 'Vuvuzela',
  },
].sort((a, b) => (a.name < b.name ? -1 : 1));

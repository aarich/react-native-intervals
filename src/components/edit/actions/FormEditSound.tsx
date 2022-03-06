import { AUDIO_FILES, load } from '../../../utils/audio';
import {
  Button,
  Icon,
  IndexPath,
  Select,
  SelectItem,
  Text,
} from '@ui-kitten/components';
import { useEffect, useState } from 'react';

import { Audio } from 'expo-av';
import { BaseFormEditProps } from './FormEdit';
import TimeInput from './TimeInput';
import { View } from 'react-native';

const FormEditSound = ({
  params,
  setParams,
  timeUnitIsSeconds,
}: BaseFormEditProps) => {
  const [sound, setSound] = useState<Audio.Sound>();
  const [playing, setPlaying] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const index = typeof params.sound === 'number' ? params.sound : 0;
    setSelectedIndex(index);
    if (!params.sound) {
      setParams((params) => ({ ...params, sound: index }));
    }
    load(AUDIO_FILES[index]).then(({ sound }) => setSound(sound));
  }, [params.sound, setParams]);

  useEffect(() => {
    if (!sound) {
      return;
    }

    sound.setOnPlaybackStatusUpdate((status) => {
      if ('isPlaying' in status) {
        setPlaying(status.isPlaying);
      } else {
        setPlaying(false);
      }
    });

    return () => {
      sound?.unloadAsync();
    };
  }, [sound]);

  return (
    <>
      <Text category="s1" style={{ paddingBottom: 10 }}>
        Make some noise! Sound an alert.
      </Text>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 4 }}>
          <Select
            selectedIndex={new IndexPath(selectedIndex)}
            onSelect={(i) =>
              setParams((params) => ({
                ...params,
                sound: (i as IndexPath).row,
              }))
            }
            value={AUDIO_FILES[selectedIndex].name}
          >
            {AUDIO_FILES.map((soundInfo, i) => (
              <SelectItem title={soundInfo.name} key={i} />
            ))}
          </Select>
        </View>
        <View>
          <Button
            onPress={() => {
              playing
                ? sound?.setStatusAsync({ shouldPlay: false })
                : sound
                    ?.setStatusAsync({ positionMillis: 0 })
                    .then(() => sound.playAsync());
              setPlaying(!playing);
            }}
            appearance="ghost"
            accessoryLeft={(props) => (
              <Icon
                {...props}
                style={[props?.style, { marginHorizontal: 0 }]}
                name={playing ? 'bell-off-outline' : 'bell-outline'}
              />
            )}
          />
        </View>
      </View>
      <TimeInput
        label="How long should the tone last?"
        valueInSecs={params.time}
        onChangeValue={(time) => setParams((params) => ({ ...params, time }))}
        timeUnitIsSeconds={timeUnitIsSeconds}
      />
    </>
  );
};

export default FormEditSound;

import { AUDIO_FILES, getAudioInfo, load } from '../../../utils/audio';
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
  const [selectedAudioId, setSelectedAudioId] = useState(0);

  useEffect(() => {
    const id = typeof params.sound === 'number' ? params.sound : 0;
    setSelectedAudioId(id);
    if (!params.sound) {
      setParams((params) => ({ ...params, sound: id }));
    }
    load(getAudioInfo(id)).then(({ sound }) => setSound(sound));
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
            selectedIndex={
              new IndexPath(
                AUDIO_FILES.findIndex((ai) => ai.id === selectedAudioId)
              )
            }
            onSelect={(i) =>
              setParams((params) => ({
                ...params,
                sound: AUDIO_FILES[(i as IndexPath).row].id,
              }))
            }
            value={getAudioInfo(selectedAudioId).name}>
            {AUDIO_FILES.map((soundInfo) => (
              <SelectItem title={soundInfo.name} key={soundInfo.id} />
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

import {
  Icon,
  IndexPath,
  Input,
  Select,
  SelectItem,
  Text,
} from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';

import { BaseFormEditProps } from './FormEdit';

const sounds = ['a', 'b'];

const FormEditSound = ({ params, setParams }: BaseFormEditProps) => {
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));

  useEffect(() => {
    setParams({ ...params, soundType: sounds[selectedIndex.row] });
  }, [params, selectedIndex, setParams]);

  return (
    <>
      <Text category="s1" style={{ paddingBottom: 10 }}>
        Make some noise! Sound an alert.
      </Text>
      <Select
        selectedIndex={selectedIndex}
        onSelect={(i) => setSelectedIndex(i as IndexPath)}
      >
        {sounds.map((sound, i) => (
          <SelectItem title={sound} key={i} />
        ))}
      </Select>
      <Input
        value={params?.time ? params?.time + '' : ''}
        label="How long should the tone last?"
        placeholder="Enter a number"
        onChangeText={(time) => setParams({ ...params, time })}
        accessoryRight={(props) => <Icon {...props} name="hash-outline" />}
      />
    </>
  );
};

export default FormEditSound;

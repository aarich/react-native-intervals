import { StyleSheet, View } from 'react-native';

import React from 'react';
import useColorScheme from '../../hooks/useColorScheme';
import { useTheme } from '@ui-kitten/components';

type Props = {
  progress: number;
};

const ProgressBar = ({ progress }: Props) => {
  const theme = useTheme();
  const scheme = useColorScheme();
  const backgroundColor = 'color-basic-' + (scheme === 'dark' ? '700' : '300');
  const barColor = 'color-basic-' + (scheme === 'dark' ? '400' : '600');
  return (
    <View
      style={[
        styles.progressBar,
        { borderColor: theme['color-basic-500'], backgroundColor },
      ]}
    >
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: theme[barColor],
            width: `${Math.floor(Math.min(progress, 100))}%`,
          },
        ]}
      />
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  progressBar: {
    flexDirection: 'row',
    height: 20,
    width: '100%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
  },
});

import ActionSelector, {
  InstructionType,
} from '../../components/edit/ActionSelector';
import { Alert, StyleSheet, View } from 'react-native';
import { Layout, useTheme } from '@ui-kitten/components';
import React, { useCallback, useState } from 'react';

import ActionIcon from '../../components/shared/ActionIcon';
import { ActionType } from '../../types';
import LayoutConstants from '../../constants/Layout';
import Swiper from 'react-native-swiper';
import TutorialScreen from '../../components/more/TutorialScreen';

const width = LayoutConstants.window.width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  image: {
    width,
    flex: 1,
  },
});

const alerts = [
  'This is the tutorial. Head to the "Flows" tab to start creating!',
  'This is still the tutorial. If you want to build stuff, go to the "Flows" tab',
  "You haven't left the tutorial yet.",
  'This is the tutorial, the graphics are just here so you know what to look for in the editor.',
  'What is this, some kind of early 2000s viral website?',
  'Stop pushing my buttons',
  "I'm gonna tap out soon",
  "You're really pressing things today",
  'My time is valuable to me, so you must understand that I take no pleasure in creating these messages.',
  " We all have a limited time on this Earth and one shouldn't dawdle on tasks like this. Do I know you? Do you know me?",
  " It isn't the case that you're gonna gain any insight from going down this rabbit hole of pushing buttons.",
  ' Heck, you could throw in the hat now and cut it out. Start from the top, re-read everything a bit more carefully.',
  " Maybe you're learning English and this is productive for you. Maybe you just like looking at your phone.",
  " But really we're the same: you and I. Two humans on opposite sides of a piece of technology. Both curious.",
  ' Who knows, maybe this goes on forever?',
  'Have you rated the app yet? Preferably positively, but more importantly honestly. You know how app developers are.',
  'On the topic of self evangelism, have you tried my other apps? You might find something you like.',
  "Anyhow I got my marketing done so there's not much left to say",
  'A møøse once bit my sister',
  'Heading back to the top now!',
];

const HelpScreen = () => {
  const theme = useTheme();
  const [alertMessageIndex, setAlertMessageIndex] = useState(0);

  const showAlert = useCallback(() => {
    const msg = alerts[alertMessageIndex];
    setAlertMessageIndex((i) => (i + 1) % alerts.length);
    Alert.alert('Tutorial', msg);
  }, [alertMessageIndex]);

  return (
    <Layout level="1" style={{ flex: 1 }}>
      <Swiper loop={false} activeDotColor={theme['color-primary-500']}>
        <View style={styles.slide}>
          <TutorialScreen
            title="Welcome"
            subtitle={
              'Create and run highly customizable interval flows.\n\nSwipe to learn how →'
            }
          />
        </View>
        <View style={styles.slide}>
          <TutorialScreen
            title="Add a Step"
            graphic={
              <ActionSelector
                onInsert={showAlert}
                allowGoTo
                instruction={InstructionType.Tutorial}
              />
            }
            subtitle={
              'Flows are made up of steps. In the flow editor you\'ll see a toolbar like this one. Tap on a step to add it to the flow. You can put steps in the middle of the flow using the "Insert Here" option'
            }
          />
        </View>
        <View style={styles.slide}>
          <TutorialScreen
            title="Actions and Waiting"
            graphic={
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}
              >
                <View style={{ flex: 1 }}>
                  <ActionIcon
                    type={ActionType.act}
                    size={110}
                    iconSize={80}
                    onPress={showAlert}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <ActionIcon
                    type={ActionType.wait}
                    size={110}
                    iconSize={80}
                    onPress={showAlert}
                  />
                </View>
              </View>
            }
            subtitle={
              'Action steps let you specify something to do for a period of time. A common thing to do in an interval flow is wait, so the Wait step is its own thing.'
            }
          />
        </View>
        <View style={styles.slide}>
          <TutorialScreen
            title='"Go To"'
            graphic={
              <ActionIcon
                type={ActionType.goTo}
                size={200}
                iconSize={150}
                showLabel={false}
                onPress={showAlert}
              />
            }
            subtitle={
              "The Go To step is unique because it lets you create loops. To use it, put it at the end of a set of steps you'd like to repeat. You can't loop inside of a loop, so calm down, Cobb."
            }
          />
        </View>
        <View style={styles.slide}>
          <TutorialScreen
            title="Sounds"
            graphic={
              <ActionIcon
                type={ActionType.sound}
                size={200}
                iconSize={150}
                showLabel={false}
                onPress={showAlert}
              />
            }
            subtitle="Play an alert of your choosing for a specific amount of time. Note sounds will not play if the app is in the background, though the timer will continue to run."
          />
        </View>
      </Swiper>
    </Layout>
  );
};

export default HelpScreen;

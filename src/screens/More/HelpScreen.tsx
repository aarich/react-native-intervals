import { Layout, useTheme } from '@ui-kitten/components';
import { useCallback, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Swiper from 'react-native-swiper/src';
import ActionSelector, {
  InstructionType,
} from '../../components/edit/ActionSelector';
import TutorialScreen from '../../components/more/TutorialScreen';
import ActionIcon from '../../components/shared/ActionIcon';
import LayoutConstants from '../../constants/Layout';
import { ActionType } from '../../types';
import { osAlert } from '../../utils/experience';

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

const makeActionGraphic = (
  types: ActionType | ActionType[] | undefined,
  onPress: VoidFunction
) => {
  if (types == null) {
    return (
      <ActionSelector
        onInsert={onPress}
        allowGoTo
        instruction={InstructionType.Tutorial}
      />
    );
  } else if (Array.isArray(types)) {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}
      >
        {types.map((t) => (
          <View style={{ flex: 1 }} key={t}>
            <ActionIcon type={t} size={110} iconSize={80} onPress={onPress} />
          </View>
        ))}
      </View>
    );
  } else {
    return (
      <ActionIcon
        type={types}
        size={200}
        iconSize={150}
        showLabel={false}
        onPress={onPress}
      />
    );
  }
};

const HelpScreen = () => {
  const theme = useTheme();
  const [alertMessageIndex, setAlertMessageIndex] = useState(0);

  const showAlert = useCallback(() => {
    const msg = alerts[alertMessageIndex];
    setAlertMessageIndex((i) => (i + 1) % alerts.length);
    osAlert('Tutorial', msg);
  }, [alertMessageIndex]);

  const makeScreen = (
    title: string,
    subtitle: string,
    types?: ActionType | ActionType[]
  ) => (
    <View style={styles.slide}>
      <TutorialScreen
        title={title}
        subtitle={subtitle}
        graphic={makeActionGraphic(types, showAlert)}
      />
    </View>
  );

  return (
    <Layout level="1" style={{ flex: 1 }}>
      <Swiper loop={false} activeDotColor={theme['color-primary-500']}>
        <View style={styles.slide}>
          <TutorialScreen
            title="Welcome"
            subtitle={`Create and run highly customizable interval flows.\n\n${Platform.select(
              { web: 'Scroll', default: 'Swipe' }
            )} to learn how →`}
          />
        </View>
        {makeScreen(
          'Add a Step',
          'Flows are made up of steps. In the flow editor you\'ll see a toolbar like this one. Tap on a step to add it to the flow. You can put steps in the middle of the flow using the "Insert Here" option'
        )}
        {makeScreen(
          'Actions and Waiting',
          'Action steps let you specify something to do for a period of time. A common thing to do in an interval flow is wait, so the Wait step is its own thing.',
          [ActionType.act, ActionType.wait]
        )}
        {makeScreen(
          'Go To',
          "The Go To step lets you create loops. To use this step, put it at the end of a set of steps you'd like to repeat.",
          ActionType.goTo
        )}
        {makeScreen(
          'Sounds',
          'Play an alert for a specific amount of time. Sounds will not play if the app is in the background, though the timer will continue to run.',
          ActionType.sound
        )}
        {makeScreen(
          'Pause',
          'When this step starts, the flow is immediately paused. This lets you do something in the flow unbound by time, like "Run around the block" or "Wait for the soup to boil"',
          ActionType.pause
        )}
      </Swiper>
    </Layout>
  );
};

export default HelpScreen;

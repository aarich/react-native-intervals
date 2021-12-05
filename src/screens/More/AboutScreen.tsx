import { Layout, Text } from '@ui-kitten/components';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

const h3 = (text: string) => (
  <Text category="h3" style={styles.h3}>
    {text}
  </Text>
);
const p = (text: string) => (
  <Text category="p1" style={styles.p}>
    {text}
  </Text>
);
const a = (name: string, url: string) => (
  <Text
    status="primary"
    style={styles.p}
    onPress={() => Linking.openURL(`https://${url}`)}
  >
    {name}
  </Text>
);

const AboutScreen = () => {
  const myVersion = Constants.manifest?.extra?.MyVersion;
  return (
    <Layout style={{ flex: 1, flexGrow: 1 }}>
      <ScrollView style={{ paddingHorizontal: '5%' }}>
        {h3('Privacy')}
        {p(
          "It's simple: this app does not collect any data from you unless we explicitly tell you. All app data is stored on the phone. " +
            'We use ads, and those ad providers have their own privacy policies.'
        )}
        {Platform.OS === 'web'
          ? p('This app uses cookies to save your timers and settings.')
          : null}
        <Text category="p1" style={styles.p}>
          Visit the developer&apos;s {a('website', 'mrarich.com/privacy')} for
          the full policy.
        </Text>
        {h3('Ads')}
        {p(
          'App stores charge to host apps. As a hobby project this' +
            ' app is supported by ads, but you can disable them at any time. ' +
            'Ads will resume after several days (you can turn them back off), but enjoy the peace in the meantime!'
        )}
        {h3('Acknowledgements')}
        {p(
          'Thanks to the following open source software and free services for making this app possible.'
        )}
        {[
          {
            name: 'Circular Progress',
            url: 'github.com/bartgryszko/react-native-circular-progress',
          },
          { name: 'Expo', url: 'expo.io' },
          { name: 'Notification Sounds', url: 'notificationsounds.com' },
          { name: 'React (Native)', url: 'reactnative.dev' },
          { name: 'Stack Overflow', url: 'stackoverflow.com' },
          { name: 'Swiper', url: 'github.com/leecade/react-native-swiper' },
          {
            name: 'UI Kitten',
            url: 'akveo.github.io/react-native-ui-kitten',
          },
        ].map((link, i) => (
          <View key={i}>{a(link.name, link.url)}</View>
        ))}
        {h3('Who is building this?')}
        <Text category="p1" style={styles.p}>
          The source code for this app is entirely public! You can browse it and
          if you like, make a contribution! Check it out on{' '}
          {a('GitHub', 'github.com/aarich/react-native-intervals')}. You can
          find out more about the developer {a('here', 'mrarich.com/about')}.
        </Text>
        {p(
          `Version ${Platform.select({
            web: '',
            default: `${Constants.nativeAppVersion}-`,
          })}${myVersion}`
        )}
        {p(`© ${new Date().getFullYear()} Alex Rich`)}
        <Text></Text>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  h3: { paddingTop: 16 },
  p: { paddingTop: 8 },
});

export default AboutScreen;

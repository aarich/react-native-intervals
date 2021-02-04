import * as Linking from 'expo-linking';

import { Layout, Text } from '@ui-kitten/components';
import { ScrollView, StyleSheet, View } from 'react-native';

import Constants from 'expo-constants';
import React from 'react';

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
    onPress={() => Linking.openURL('https://' + url)}
  >
    {name}
  </Text>
);

const AboutScreen = () => {
  return (
    <Layout style={{ flex: 1, flexGrow: 1 }}>
      <ScrollView style={{ paddingHorizontal: '5%' }}>
        {h3('Privacy')}
        {p(
          "It's simple: this app does not collect any data from you unless we explicitly tell you. All app data is stored on the phone. " +
            'We use ads, and those ad providers have their own privacy policies.'
        )}
        <Text category="p1" style={styles.p}>
          Visit the developer&apos;s {a('website', 'mrarich.com/privacy')} for
          the full policy.
        </Text>
        {h3('Ads')}
        {p(
          'App stores charge to host apps. As a hobby project this' +
            ' app is supported by ads, but you can disable them at any time!'
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
        {p(
          'The source code for this app is entirely public! You can browse it and if you like, make a contribution!'
        )}
        <Text category="p1" style={styles.p}>
          Check it out on {a('GitHub', 'github.com/aarich/intervals')}.
        </Text>
        <Text category="p1" style={styles.p}>
          You can find out more about the developer{' '}
          {a('here', 'mrarich.com/about')}.
        </Text>
        {p(`© ${new Date().getFullYear()} Alex Rich`)}
        {p(
          `Version ${Constants.nativeAppVersion}-${Constants.manifest.extra.MyVersion}`
        )}
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

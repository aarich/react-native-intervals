import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Icon, Layout, Text } from '@ui-kitten/components';
import { openURL } from 'expo-linking';
import * as StoreReview from 'expo-store-review';
import { ReactNode, useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

const baseMainURL = 'https://mrarich.com';

const getContactUrl = (message: string) =>
  `${baseMainURL}/contact${message ? '?m=' + message : ''}`;

const makeButton = (title: string, icon: string, onPress: () => void) => (
  <View style={{ width: '100%' }} key={icon}>
    <Button
      size="giant"
      appearance="ghost"
      accessoryLeft={(props) => <Icon {...props} name={icon} />}
      onPress={onPress}
    >
      {title}
    </Button>
  </View>
);

const FeedbackScreen = () => {
  const [storeReviewAvailable, setStoreReviewAvailable] = useState(false);
  const issuesUrl =
    'https://github.com/aarich/react-native-intervals/issues/new';

  const appStoreUrl =
    'https://apps.apple.com/app/apple-store/id1552160706?ct=inappfeedback&mt=8';
  const playStoreUrl =
    'https://play.google.com/store/apps/details?id=com.mrarich.Intervals';
  const appStoreButton = makeButton(
    `Open in the Apple App Store`,
    'smartphone-outline',
    () => openURL(appStoreUrl)
  );
  const playStoreButton = makeButton(
    'Open in the Google Play Store',
    'google-outline',
    () => openURL(playStoreUrl)
  );

  const requestReview = () => {
    AsyncStorage.setItem('REVIEW', 'asked');
    StoreReview.requestReview();
  };

  useEffect(() => {
    StoreReview.isAvailableAsync().then((available) => {
      setStoreReviewAvailable(available);
      if (available) {
        StoreReview.hasAction().then((hasAction) => {
          if (!hasAction) {
            setStoreReviewAvailable(false);
            return;
          }
          AsyncStorage.getItem('REVIEW').then((val) => {
            if (!val) {
              requestReview();
            }
          });
        });
      }
    });
  }, []);

  return (
    <Layout style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text category="h6" style={styles.descText}>
          How are you using this app? Have a bug to report? Want to share the
          app with others?
        </Text>
        <View>
          {Platform.select<ReactNode>({
            web: [appStoreButton, playStoreButton],
            ios: appStoreButton,
            android: playStoreButton,
          })}
          {makeButton('Contact Directly', 'message-circle-outline', () =>
            openURL(getContactUrl('Feedback for Intervals: '))
          )}
          {makeButton('Create an Issue on GitHub', 'github-outline', () =>
            openURL(issuesUrl)
          )}
          {storeReviewAvailable
            ? makeButton('Rate the App', 'star-outline', requestReview)
            : null}
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  descText: {
    textAlign: 'center',
    paddingTop: 10,
    paddingHorizontal: 40,
    paddingBottom: 50,
  },
});

export default FeedbackScreen;

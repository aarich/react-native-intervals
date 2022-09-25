import { GestureHandlerRootView } from 'react-native-gesture-handler';
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import * as Sentry from 'sentry-expo';

import { captureException } from '@sentry/react-native';

import Navigation from './src/navigation';
import { persistor, store } from './src/redux/store';

Sentry.init({
  dsn: 'https://52cedabf65b0457c9f373fd935fe218e@o583200.ingest.sentry.io/5755214',
  debug: __DEV__,
  autoSessionTracking: true,
});

mobileAds()
  .setRequestConfiguration({ maxAdContentRating: MaxAdContentRating.G })
  .then(() => mobileAds().initialize())
  .catch(captureException);

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Navigation />
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

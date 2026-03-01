import 'react-native-gesture-handler';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import * as Sentry from '@sentry/react-native';
import Navigation from './src/navigation';
import { persistor, store } from './src/redux/store';
import {
  requestNotificationPermissionImmediately,
} from './src/utils/background/notifications';
import { liveActivityManager } from './src/utils/background/liveActivityManager';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  debug: __DEV__,
  enableAutoSessionTracking: true,
  normalizeDepth: 5,
});

export default Sentry.wrap(function App() {
  useEffect(() => {
    void requestNotificationPermissionImmediately();

    return () => {
      void liveActivityManager.stop();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Navigation />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
});

import * as Sentry from 'sentry-expo';

import { persistor, store } from './src/redux/store';

import Navigation from './src/navigation';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

Sentry.init({
  dsn:
    'https://52cedabf65b0457c9f373fd935fe218e@o583200.ingest.sentry.io/5755214',
  enableInExpoDevelopment: true,
  debug: __DEV__,
  autoSessionTracking: true,
});

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Navigation />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}

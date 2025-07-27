import React from 'react';
import { Provider, useDispatch } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {
  ApplicationProvider,
  IconRegistry,
  ModalService,
} from '@ui-kitten/components';
import * as eva from '@eva-design/eva';

import { persistor, store } from './services/store';
import { $config } from './services/app/action';

import { IconsPack } from './components/utils/iconAdapter';
import { default as theme } from './components/theme/custom-theme.json';
import { default as mapping } from '../mapping.json';

import AppNavigator from './navigator';

function Boot() {
  const dispatch = useDispatch();

  const boot = async () => {
    await dispatch($config());
  };

  React.useEffect(() => {
    boot();
  }, []);

  return null;
}

ModalService.setShouldUseTopInsets = true;

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <IconRegistry icons={IconsPack} />
          <ApplicationProvider
            {...eva}
            theme={{ ...eva.light, ...theme }}
            customMapping={mapping}
          >
            <SafeAreaProvider>
              <Boot />
              <AppNavigator />
            </SafeAreaProvider>
          </ApplicationProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;

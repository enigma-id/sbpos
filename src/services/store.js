import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import rootReducer from './reducer';

import {authApi} from './auth/action';
import {salesSessionApi} from './sales/session/action';
import {salesOrderApi} from './sales/order/action';
import {catalogApi} from './catalog/action';
import {salesChannelApi} from './sales/channel/action';
import {cartApi} from './cart/action';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: [
    'authApi',
    'salesSessionApi',
    'salesOrderApi',
    'salesChannelApi',
    'catalogApi',
    'cartApi',
    '_persist',
  ],
  debug: true,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const apiMiddleware = [
  authApi.middleware,
  catalogApi.middleware,
  salesSessionApi.middleware,
  salesOrderApi.middleware,
  salesChannelApi.middleware,
  cartApi.middleware,
];

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(apiMiddleware),
});

// dev only
function omit(obj, keys) {
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => !keys.includes(k)),
  );
}
store.subscribe(() => {
  const state = store.getState();
  const filteredState = omit(state, [
    'authApi',
    'salesSessionApi',
    'salesOrderApi',
    'salesChannelApi',
    'catalogApi',
    'cartApi',
  ]);
  console.log('Redux state changed:', filteredState);
});
//

const persistor = persistStore(store);

export {store, persistor};

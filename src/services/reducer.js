import {combineReducers} from '@reduxjs/toolkit';

import {activityReducer} from './activity/slice';
import {appReducer} from './app/slice';
import {formReducer} from './form/slice';

import {authReducer} from './auth/slice';
import {authApi} from './auth/action';

import {sessionReducer} from './sales/session/slice';
import {salesSessionApi} from './sales/session/action';
import {salesOrderApi} from './sales/order/action';
import {catalogApi} from './catalog/action';
import {salesChannelApi} from './sales/channel/action';
import {channelReducer} from './sales/channel/slice';
import {cartReducer} from './cart/slice';
import {cartApi} from './cart/action';

const apiReducers = {
  [authApi.reducerPath]: authApi.reducer,
  [salesSessionApi.reducerPath]: salesSessionApi.reducer,
  [salesOrderApi.reducerPath]: salesOrderApi.reducer,
  [salesChannelApi.reducerPath]: salesChannelApi.reducer,
  [catalogApi.reducerPath]: catalogApi.reducer,
  [cartApi.reducerPath]: cartApi.reducer,
};

const rootReducer = combineReducers({
  Activity: activityReducer,
  App: appReducer,
  Form: formReducer,
  Auth: authReducer,
  SalesSession: sessionReducer,
  SalesChannel: channelReducer,
  Cart: cartReducer,
  ...apiReducers,
});

export default rootReducer;

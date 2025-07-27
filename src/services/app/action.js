import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { CONFIG } from '../config';
// import VersionCheck from 'react-native-version-check';

const MODULE = 'App';

export const $reset = createAction(`${MODULE}/reset`);
export const $ready = createAction(`${MODULE}/ready`);
export const $needUpdate = createAction(`${MODULE}/update`);

export const $config = createAsyncThunk(
  `${MODULE}/config`,
  async (_, { dispatch }) => {
    let config = CONFIG;

    setConfig(config);

    dispatch($ready());

    return {};
    // return await loadConfig().then(res => {
    //   if (__DEV__) {
    //     config = CONFIG;
    //     setConfig(config);
    //     dispatch($ready());
    //   } else {
    //     // if (
    //     //   res?.versionBuild > Application?.nativeBuildVersion &&
    //     //   res?.forceUpdate
    //     // ) {
    //     //   dispatch($needUpdate());
    //     // } else {
    //     //   dispatch($ready());
    //     // }
    //     setConfig(res);
    //   }
    // });
  },
);

function setConfig(data) {
  if (__DEV__) {
    global.API_URL = data.apiURLDev;
  } else {
    global.API_URL = data.apiURL;
  }
}

// async function loadConfig() {
//   const configProvider = () => {
//     return fetch(CONFIG.configURL, {
//       headers: { 'Cache-Control': 'max-age=120' },
//     }).then(r => r.json());
//   };

//   return await VersionCheck.getLatestVersion({ provider: configProvider })
//     .catch(() => CONFIG)
//     .then(res => res);
// }

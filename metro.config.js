const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');
// Ambil config default dulu
const defaultConfig = getDefaultConfig(__dirname);

// Tambahkan konfigurasi khusus (jika ada)
const customConfig = {};

// Gabungkan semua config
const finalConfig = mergeConfig(defaultConfig, customConfig);

// Bungkus dengan konfigurasi Reanimated
module.exports = wrapWithReanimatedMetroConfig(finalConfig);

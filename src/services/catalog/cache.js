import AsyncStorage from '@react-native-async-storage/async-storage';

//
// Base cache (default)
//

export const getCache = async key => {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;

    const { data } = JSON.parse(raw);
    return data;
  } catch (err) {
    console.error('Error reading cache', err);
    return null;
  }
};

export const setCache = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify({ data }));
  } catch (err) {
    console.error('Error setting cache', err);
  }
};

export const getOrFetch = async (key, fetcher) => {
  const cached = await getCache(key);
  if (cached || (Array.isArray(cached) && cached.length > 0)) return cached;

  try {
    const data = await fetcher();
    await setCache(key, data);
    return data;
  } catch (e) {
    console.error('getOrFetch error for', key, e);
    return null;
  }
};

// //
// // Grouped cache: cache_sales
// //

// const SALES_CACHE_KEY = 'cache_sales';

// const getSalesCacheRaw = async () => {
//   try {
//     const raw = await AsyncStorage.getItem(SALES_CACHE_KEY);
//     return raw ? JSON.parse(raw) : {};
//   } catch {
//     return {};
//   }
// };

// const setSalesCacheRaw = async data => {
//   const existing = await getSalesCacheRaw();
//   const updated = { ...existing, ...data };
//   await AsyncStorage.setItem(SALES_CACHE_KEY, JSON.stringify(updated));
// };

// export const getSalesCacheValue = async key => {
//   const cache = await getSalesCacheRaw();
//   return cache?.[key] ?? null;
// };

// export const setSalesCacheValue = async (key, value) => {
//   await setSalesCacheRaw({ [key]: value });
// };

// export const getOrFetchSales = async (key, fetcher) => {
//   const cached = await getSalesCacheValue(key);
//   if (cached || (Array.isArray(cached) && cached.length > 0)) return cached;

//   try {
//     const result = await fetcher();
//     await setSalesCacheValue(key, result);
//     return result;
//   } catch (e) {
//     console.error(`getOrFetchSales error for ${key}`, e);
//     return null;
//   }
// };

// export const clearSalesCache = async () => {
//   await AsyncStorage.removeItem(SALES_CACHE_KEY);
// };

//
// Grouped cache: cache_catalog
//

const CATALOG_CACHE_KEY = 'cache_catalog';

const getCatalogCacheRaw = async () => {
  try {
    const raw = await AsyncStorage.getItem(CATALOG_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const setCatalogCacheRaw = async data => {
  const existing = await getCatalogCacheRaw();
  const updated = { ...existing, ...data };
  await AsyncStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify(updated));
};

export const getCatalogCacheValue = async key => {
  const cache = await getCatalogCacheRaw();
  return cache?.[key] ?? null;
};

export const setCatalogCacheValue = async (key, value) => {
  await setCatalogCacheRaw({ [key]: value });
};

export const getOrFetchCatalog = async (key, fetcher) => {
  const cached = await getCatalogCacheValue(key);
  if (cached || (Array.isArray(cached) && cached.length > 0)) return cached;

  try {
    const result = await fetcher();
    await setCatalogCacheValue(key, result);
    return result;
  } catch (e) {
    console.error(`getOrFetchCatalog error for ${key}`, e);
    return null;
  }
};

export const setCatalogDetailCache = async (id, channelId, data) => {
  const raw = await getCatalogCacheRaw();
  const current = raw?.detail_catalog || {};

  const key = `${channelId}_${id}`;
  const updatedDetail = { ...current, [key]: data };

  await setCatalogCacheRaw({ ...raw, detail_catalog: updatedDetail });
};

export const getCatalogDetailCache = async (id, channelId) => {
  const cache = await getCatalogCacheRaw();
  const key = `${channelId}_${id}`;
  return cache?.detail_catalog?.[key] || null;
};

export const clearCatalogCache = async () => {
  await AsyncStorage.removeItem(CATALOG_CACHE_KEY);
};

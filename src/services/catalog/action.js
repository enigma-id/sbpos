import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../baseQuery';

export const catalogApi = createApi({
  reducerPath: 'catalogApi',
  baseQuery: baseQuery,
  endpoints: builder => ({
    // ✅ Dijalankan manual saat user pilih produk
    getCatalogPricing: builder.query({
      query: ({ page = 1, limit = 20, ...params }) => ({
        url: '/catalog/pricing',
        method: 'GET',
        params: {
          page,
          limit,
          ...params, // include channel_id, category_id, etc
        },
      }),
    }),

    // ✅ Ini bisa dijalankan langsung saat komponen mount (useQuery atau lazy)
    getCategories: builder.query({
      query: () => ({
        url: '/catalog/category',
        method: 'GET',
      }),
    }),

    getCatalogDetail: builder.query({
      query: ({ id, channel_id }) => ({
        url: `/catalog/${id}`,
        method: 'GET',
        params: {
          channel_id: channel_id,
        },
      }),
    }),
  }),
});

// ⬇️ Export lazy hooks (sesuai strategi yang kita sepakati)
export const {
  useLazyGetCatalogPricingQuery,
  useGetCategoriesQuery,
  useLazyGetCatalogDetailQuery,
} = catalogApi;

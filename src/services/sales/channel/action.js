import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQuery} from '../../baseQuery';

export const salesChannelApi = createApi({
  reducerPath: 'salesChannelApi',
  baseQuery: baseQuery,
  endpoints: builder => ({
    getSalesChannels: builder.query({
      query: () => ({
        url: '/sales/channel',
        method: 'GET',
      }),
      transformResponse: response => response?.data || [], // Sesuaikan struktur response-mu
    }),
  }),
});

export const {useGetSalesChannelsQuery} = salesChannelApi;

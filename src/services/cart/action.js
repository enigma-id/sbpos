import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../baseQuery';

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: baseQuery,
  endpoints: builder => ({
    checkout: builder.mutation({
      query: payload => {
        console.log('[CHECKOUT REQUEST]', payload);
        return {
          url: '/sales/order',
          method: 'POST',
          body: payload,
        };
      },
      // query: payload => ({
      //   url: '/sales/order',
      //   method: 'POST',
      //   body: payload,
      // }),
    }),
    update: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/sales/order/${id}`,
        method: 'PUT',
        body: payload,
      }),
    }),
    getMethod: builder.query({
      query: params => ({
        url: '/sales/payment',
        method: 'GET',
        params,
      }),
    }),
  }),
});

export const { useCheckoutMutation, useUpdateMutation, useLazyGetMethodQuery } =
  cartApi;

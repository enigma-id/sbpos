import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base fetchBaseQuery
const rawBaseQuery = fetchBaseQuery({
  baseUrl: global.API_URL || 'https://api.envio.co.id/dev/pos',
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.Auth?.session?.token;
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Custom baseQuery with dev logging
export const baseQuery = async (args, api, extraOptions) => {
  if (__DEV__) {
    const url = typeof args === 'string' ? args : args.url;
    const method = typeof args === 'object' ? args.method : undefined;
    const body = typeof args === 'object' ? args.body : undefined;
    const params = typeof args === 'object' ? args.params : undefined;

    const result = await rawBaseQuery(args, api, extraOptions);

    console.log(
      '%c[RTKQ] URL: ' + url,
      'color: #fff; background: #007acc; font-weight: bold; padding:2px 6px; border-radius:3px;',
    );
    if (method) {
      console.log(
        '%c[RTKQ] Method: ' + method,
        'color: #fff; background: #2dba4e; font-weight: bold; padding:2px 6px; border-radius:3px;',
      );
    }
    if (params) {
      console.log(
        '%c[RTKQ] Params: ',
        'color: #fff; background: #b8860b; font-weight: bold; padding:2px 6px; border-radius:3px;',
        params,
      );
    }
    if (body) {
      console.log(
        '%c[RTKQ] Payload: ',
        'color: #fff; background: #d9534f; font-weight: bold; padding:2px 6px; border-radius:3px;',
        body,
      );
    }
    console.log(
      '%c[RTKQ] Response:',
      'color: #fff; background: #6c757d; font-weight: bold; padding:2px 6px; border-radius:3px;',
      result,
    );
  }
  return rawBaseQuery(args, api, extraOptions);
};

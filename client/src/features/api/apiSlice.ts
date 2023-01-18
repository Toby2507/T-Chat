import { BaseQueryFn } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../app/store';
import { stateInterface } from '../../utilities/interfaces';
import { clearCredentials, setCredentials } from '../api/globalSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/api/v1',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    headers.set('Accept', 'application/json');
    headers.set('Cache-Control', 'no-cache');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');

    const accessToken = (getState() as RootState).user.accessToken;
    if (accessToken) {
      headers.set('authorization', `Bearer ${accessToken}`);
    }
    return headers;
  }
});

const baseQueryWithReAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (arg, api, extraOptions) => {
  let result = await baseQuery(arg, api, extraOptions);
  if (result?.error?.status === 401 || result?.error?.data === 'Unauthorized') {
    const refreshResult = await baseQuery('auth/refreshaccess', api, extraOptions);
    if (refreshResult?.data) {
      const res = refreshResult.data as stateInterface;
      api.dispatch(setCredentials({ ...res }));
      result = await baseQuery(arg, api, extraOptions);
    } else {
      await baseQuery('auth/logout', api, extraOptions);
      api.dispatch(clearCredentials());
    }
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReAuth,
  tagTypes: ['Users', 'Messages'],
  endpoints: builder => ({})
});

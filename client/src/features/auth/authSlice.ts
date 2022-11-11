import { apiSlice } from '../api/apiSlice';
import { setCredentials, clearCredentials } from './userSlice';

export const authSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    signup: builder.mutation({
      query: credentials => ({
        url: '/auth/signup',
        method: 'POST',
        body: { ...credentials }
      })
    }),
    login: builder.mutation({
      query: credentials => ({
        url: '/auth/login',
        method: 'POST',
        body: { ...credentials }
      })
    }),
    logout: builder.mutation({
      query: () => '/auth/logout',
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(clearCredentials());
        dispatch(apiSlice.util.resetApiState());
      }
    }),
    setPP: builder.mutation({
      query: formData => ({
        url: '/user/setprofilepicture',
        method: 'POST',
        body: formData
      })
    })
  })
});

export const { useSignupMutation, useLoginMutation, useSetPPMutation, useLogoutMutation } = authSlice;
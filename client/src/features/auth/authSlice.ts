import { createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';
import { setCredentials, clearCredentials, userInterface } from '../api/globalSlice';

const usersAdapter = createEntityAdapter({
  selectId: (user: userInterface) => user._id
});
const initialState = usersAdapter.getInitialState();

export const authSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUsers: builder.query({
      query: () => 'user/getallusers',
      transformResponse: (res: userInterface[]) => usersAdapter.setAll(initialState, res),
      // providesTags: (result) => [{ type: 'Users', id: 'LIST'}, ...result?.ids.map(id => ({ type: 'Users', id}))]
    }),
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
    setPP: builder.mutation({
      query: formData => ({
        url: '/user/setprofilepicture',
        method: 'POST',
        body: formData
      })
    }),
    verifyUser: builder.mutation({
      query: verifyCode => ({
        url: `user/verify/${verifyCode}`,
        method: 'GET'
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const result = await queryFulfilled;
        dispatch(setCredentials({ ...result.data }));
      }
    }),
    resendVerifyEmail: builder.mutation({
      query: () => ({
        url: 'user/resendverifyemail',
        method: 'GET'
      })
    }),
    forgotPassword: builder.mutation({
      query: email => ({
        url: 'user/forgotpassword',
        method: 'POST',
        body: { email }
      })
    }),
    resendFPEmail: builder.mutation({
      query: email => ({
        url: 'user/resendforgotpasswordemail',
        method: 'POST',
        body: { email }
      })
    }),
    resetPassword: builder.mutation({
      query: ({ id, passwordResetCode, password }) => ({
        url: `user/resetpassword/${id}/${passwordResetCode}`,
        method: 'POST',
        body: { password }
      })
    }),
    refresh: builder.query({
      query: () => '/auth/refreshaccess',
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const result = await queryFulfilled;
        dispatch(setCredentials({ ...result.data }));
      }
    }),
    logout: builder.mutation({
      query: () => '/auth/logout',
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(clearCredentials());
        dispatch(apiSlice.util.resetApiState());
      }
    })
  })
});

export const {
  useSignupMutation,
  useLoginMutation,
  useSetPPMutation,
  useLogoutMutation,
  useRefreshQuery,
  useVerifyUserMutation,
  useResendVerifyEmailMutation,
  useForgotPasswordMutation,
  useResendFPEmailMutation,
  useResetPasswordMutation
} = authSlice;
import { createEntityAdapter, createSelector, EntityState } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { apiSlice } from '../api/apiSlice';
import { clearCredentials, setCredentials, userInterface } from '../api/globalSlice';

const usersAdapter = createEntityAdapter<userInterface>({
  selectId: user => user._id
});
const initialState = usersAdapter.getInitialState();

export const authSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUsers: builder.query<EntityState<userInterface>, void>({
      query: () => 'user/getallusers',
      transformResponse: (res: userInterface[]) => {
        return usersAdapter.setAll(initialState, res);
      },
      providesTags: (result, error, arg) => result ? [{ type: 'Users' as const, id: 'LIST' }, ...result.ids.map(id => ({ type: 'Users' as const, id }))] : [{ type: 'Users' as const, id: 'LIST' }]
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

export const selectUsersResult = authSlice.endpoints.getUsers.select();
const selectUsersData = createSelector(selectUsersResult, result => result.data);
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds
} = usersAdapter.getSelectors<RootState>(state => selectUsersData(state) ?? initialState);
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
  useResetPasswordMutation,
  useGetUsersQuery
} = authSlice;
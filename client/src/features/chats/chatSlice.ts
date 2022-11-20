import { apiSlice } from "../api/apiSlice";

export const chatSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getAllUsers: builder.query({
      query: () => 'user/getallusers'
    })
  })
});

export const {
  useGetAllUsersQuery
} = chatSlice;
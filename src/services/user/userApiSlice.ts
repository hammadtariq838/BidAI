import {
  fetchBaseQuery,
  createApi,
  BaseQueryApi,
  FetchArgs,
} from '@reduxjs/toolkit/query/react';

import {
  BaseResponse,
  UserResponse,
} from '@/types/response.type';
import {
  LoginUserRequest,
  CreateUserRequest,
} from '@/types/request.type';

import { USERS_URL } from '@/constants';
import { clearAuth } from '@/features/auth/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: USERS_URL,
  prepareHeaders: (headers) => {
    return headers;
  },
  credentials: 'include',
});

async function baseQueryWithAuth(
  args: string | FetchArgs,
  api: BaseQueryApi,
  extra: object
) {
  const result = await baseQuery(args, api, extra);
  // Dispatch the logout action on 401.
  if (result.error && result.error.status === 401) {
    api.dispatch(clearAuth());
  }
  return result;
}

export const userApiSlice = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    createAccount: builder.mutation<
      UserResponse,
      CreateUserRequest
    >({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
      }),
    }),
    signin: builder.mutation<
      UserResponse,
      LoginUserRequest
    >({
      query: (body) => ({
        url: '/login',
        method: 'POST',
        body,
      }),
    }),
    signout: builder.mutation<BaseResponse, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
    }),
    getProfile: builder.query<UserResponse, void>({
      query: () => '/profile',
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: '/profile',
        method: 'PUT',
        body: data,
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: ['User'],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/${userId}`,
        method: 'DELETE',
      }),
    }),
    getUserDetails: builder.query({
      query: (id) => ({
        url: `/${id}`,
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `/${data.userId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useCreateAccountMutation,
  useSigninMutation,
  useSignoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} = userApiSlice;

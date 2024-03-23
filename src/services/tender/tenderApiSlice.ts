import {
  fetchBaseQuery,
  createApi,
  BaseQueryApi,
  FetchArgs,
} from '@reduxjs/toolkit/query/react';

import {
  TendersResponse,
  TenderByIdResponse,
  CountiesResponse,
  TenderTypesResponse,
  BiddersResponse,
} from '@/types/response.type';
import { GetTendersRequest } from '@/types/request.type';

import { TENDERS_URL } from '@/constants';
import { clearAuth } from '@/features/auth/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: TENDERS_URL,
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

export const tenderApiSlice = createApi({
  reducerPath: 'tenderApi',
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getTenders: builder.query<
      TendersResponse,
      GetTendersRequest
    >({
      query: (params) => ({
        url: '/',
        method: 'GET',
        params,
      }),
    }),
    getTenderById: builder.query<
      TenderByIdResponse,
      string
    >({
      query: (id) => `/${id}`,
    }),

    getCounties: builder.query<CountiesResponse, void>({
      query: () => '/counties',
    }),
    getTenderTypes: builder.query<
      TenderTypesResponse,
      void
    >({
      query: () => '/tender-types',
    }),
    getBidders: builder.query<BiddersResponse, void>({
      query: () => '/bidders',
    }),
  }),
});

export const {
  useGetTendersQuery,
  useGetTenderByIdQuery,
  useGetBiddersQuery,
  useGetCountiesQuery,
  useGetTenderTypesQuery,
} = tenderApiSlice;

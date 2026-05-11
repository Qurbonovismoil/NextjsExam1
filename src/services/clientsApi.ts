import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Client, Profile } from '../types/client';

export const clientsApi = createApi({
  reducerPath: 'clientsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001' }),
  tagTypes: ['Client', 'Profile'],
  endpoints: (builder) => ({
    getClients: builder.query<{ clients: Client[], totalCount: number }, { page: number; limit: number }>({
      query: ({ page, limit }) => `/clients?_page=${page}&_per_page=${limit}`,
      transformResponse: (response: any, meta) => {
        // Handle json-server v1 format { data: Client[], items: number } or older array format
        const clientsArray = Array.isArray(response) ? response : (response.data || []);
        const totalCount = response.items !== undefined 
          ? Number(response.items) 
          : Number(meta?.response?.headers.get('X-Total-Count') || clientsArray.length);
          
        return { clients: clientsArray, totalCount };
      },
      providesTags: ['Client'],
    }),
    getClientById: builder.query<Client, number | string>({
      query: (id) => `/clients/${id}`,
      providesTags: (result, error, id) => [{ type: 'Client', id: String(id) }],
    }),
    addClient: builder.mutation<Client, Partial<Client>>({
      query: (body) => ({
        url: '/clients',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Client'],
    }),
    updateClient: builder.mutation<Client, { id: number | string; data: Partial<Client> }>({
      query: ({ id, data }) => ({
        url: `/clients/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Client', id: String(id) }, 'Client'],
    }),
    deleteClient: builder.mutation<void, number | string>({
      query: (id) => ({
        url: `/clients/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Client'],
    }),
    getProfile: builder.query<Profile, void>({
      query: () => '/profile',
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation<Profile, Partial<Profile>>({
      query: (data) => ({
        url: '/profile',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    })
  }),
});

export const {
  useGetClientsQuery,
  useGetClientByIdQuery,
  useAddClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useGetProfileQuery,
  useUpdateProfileMutation
} = clientsApi;

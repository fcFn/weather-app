import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

interface ApiResponse {
  message: string
}

interface User {
  id: string | null
  username: string | null
  favorites?: string[]
}

interface Credentials {
  username: string
  password: string
}

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ credentials: "include", baseUrl: import.meta.env.VITE_BACKEND_URL }),
  reducerPath: "api",
  tagTypes: ["User"],
  endpoints: build => ({
    getUser: build.query<User, void>({
      query: () => ({
        url: "/user",
        method: "GET",
      }),
      transformResponse: (response: { user: User }) => response.user,
      providesTags: ["User"],
    }),
    authUser: build.mutation<User, Credentials>({
      query: credentials => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: { user: User }) => response.user,
      invalidatesTags: ["User"],
    }),
    registerUser: build.mutation<User, Credentials>({
      query: credentials => ({
        url: "/register",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: build.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "GET",
      }),
      invalidatesTags: ["User"],
    }),
    getCurrentConditions: build.query({
      query: key => ({
        url: `/current-conditions?q=${key}`,
      }),
    }),
    getLocation: build.query({
      query: key => ({
        url: `/location?q=${key}`,
      }),
    }),
    getForecast: build.query({
      query: key => ({
        url: `/forecast?q=${key}`,
      }),
    }),
    addFavorite: build.mutation<ApiResponse, string>({
      query: key => ({
        url: `/favorite/${key}`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const dispatchResult = dispatch(
          apiSlice.util.updateQueryData("getUser", undefined, draft => {
            if (draft?.favorites) {
              draft.favorites.push(arg)
            }
          }),
        )
        try {
          await queryFulfilled
        } catch {
          dispatchResult.undo()
        }
      },
    }),
    removeFavorite: build.mutation<ApiResponse, string>({
      query: key => ({
        url: `/favorite/${key}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const dispatchResult = dispatch(
          apiSlice.util.updateQueryData("getUser", undefined, draft => {
            if (draft?.favorites) {
              const index = draft.favorites.indexOf(arg)
              if (index > -1) {
                draft.favorites.splice(index, 1)
              }
            }
          }),
        )
        try {
          await queryFulfilled
        } catch {
          dispatchResult.undo()
        }
      },
    }),
  }),
})

export const {
  useGetUserQuery,
  useAuthUserMutation,
  useRegisterUserMutation,
  useLogoutMutation,
  useGetCurrentConditionsQuery,
  useGetLocationQuery,
  useGetForecastQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} = apiSlice

import { baseApi } from "../baseApi";

export const auctionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAuctions: builder.query({
      query: () => "/auctions",
      providesTags: ["Auction"],
    }),

    getAuctionById: builder.query({
      query: (id: string) => `/auctions/${id}`,
      providesTags: ["Auction"],
    }),

    createAuction: builder.mutation({
      query: (data) => ({
        url: "/auctions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auction"],
    }),

    placeBid: builder.mutation({
      query: ({ id, amount }) => ({
        url: `/auctions/${id}/bid`,
        method: "POST",
        body: { amount },
      }),
      invalidatesTags: ["Auction"],
    }),
  }),
});

export const {
  useGetAuctionsQuery,
  useGetAuctionByIdQuery,
  useCreateAuctionMutation,
  usePlaceBidMutation,
} = auctionApi;
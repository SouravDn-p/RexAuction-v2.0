import {
    createApi,
    fetchBaseQuery,
    type BaseQueryFn,
    type FetchArgs,
    type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_URL;

// 1. Base query (normal requests)
const rawBaseQuery = fetchBaseQuery({
    baseUrl: baseUrl,
    credentials: "include",
    prepareHeaders: (headers) => {
        headers.set("content-type", "application/json");
        return headers;
    },
});

// 2. Refresh token base query (separate instance)
const refreshBaseQuery = fetchBaseQuery({
    baseUrl: baseUrl,
    credentials: "include",
});

// 3. Wrapper with auto refresh logic
const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    // If not unauthorized → return normally
    if (result.error?.status !== 401) {
        return result;
    }

    // 🔥 Try refresh token
    const refreshResult = await refreshBaseQuery(
        {
            url: "/auth/refresh",
            method: "POST",
        },
        api,
        extraOptions
    );

    // If refresh failed → logout user
    if (refreshResult.error) {
        console.log("Refresh token expired. Logging out...");
        // optional: dispatch logout action here
        return result;
    }

    // 🔁 Retry original request after refresh success
    result = await rawBaseQuery(args, api, extraOptions);

    return result;
};

// 4. Create API
export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Auth", "Auction", "User"],
    endpoints: () => ({}),
});
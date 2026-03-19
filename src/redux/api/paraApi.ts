import { TApiResponse } from "@/types/api";
import { TCreateParaPayload, TPara, TUpdateParaPayload } from "@/types/para";
import { tagTypes } from "../tags";
import { baseServerApi } from "./baseApi";

export const paraApi = baseServerApi.injectEndpoints({
  endpoints: (build) => ({
    // Public: get all paras
    getAllParas: build.query<TApiResponse<TPara[]>, void | Record<string, any>>(
      {
        query: (arg) => ({
          url: "/para",
          method: "GET",
          params: arg,
        }),
        providesTags: [tagTypes.para],
      },
    ),

    // Admin: get all paras
    getAllParasByAdmin: build.query<
      TApiResponse<TPara[]>,
      void | Record<string, any>
    >({
      query: (arg) => ({
        url: "/para/admin",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.para],
    }),

    // Get single para by ID
    getParaById: build.query<TApiResponse<TPara>, string>({
      query: (paraId) => ({
        url: `/para/${paraId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, paraId) => [
        { type: tagTypes.para, id: paraId },
      ],
    }),
    // Create para
    createPara: build.mutation<TApiResponse<TPara>, TCreateParaPayload>({
      query: (payload) => ({
        url: "/para",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [tagTypes.para],
    }),

    // Update para
    updatePara: build.mutation<
      TApiResponse<TPara>,
      { paraId: string; payload: TUpdateParaPayload }
    >({
      query: ({ paraId, payload }) => ({
        url: `/para/${paraId}`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: (_result, _error, { paraId }) => [
        { type: tagTypes.para, id: paraId },
      ],
    }),

    // Soft delete para
    softDeletePara: build.mutation<TApiResponse<null>, string>({
      query: (paraId) => ({
        url: `/para/${paraId}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.para],
    }),
  }),
});

export const {
  useGetAllParasQuery,
  useGetAllParasByAdminQuery,
  useGetParaByIdQuery,
  useCreateParaMutation,
  useUpdateParaMutation,
  useSoftDeleteParaMutation,
} = paraApi;

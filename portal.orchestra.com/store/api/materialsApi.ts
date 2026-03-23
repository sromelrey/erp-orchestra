import { baseApi } from './baseApi';
import { PaginatedResponse } from '@/types';

export enum MaterialType {
  RAW = 'RAW',
  SEMI_FINISHED = 'SEMI_FINISHED',
  FINISHED = 'FINISHED',
  SERVICE = 'SERVICE',
}

export interface Material {
  id: number;
  sku: string;
  name: string;
  description?: string;
  materialType: MaterialType;
  materialGroup?: string;
  baseUom: string;
  netWeight?: number;
  weightUom?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  tenantId: number;
}

export interface CreateMaterialRequest {
  sku: string;
  name: string;
  description?: string;
  materialType: MaterialType;
  materialGroup?: string;
  baseUom: string;
  netWeight?: number;
  weightUom?: string;
  isActive?: boolean;
}

export interface UpdateMaterialRequest extends Partial<CreateMaterialRequest> {
  id: number;
}

export interface MaterialsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  materialType?: MaterialType;
  materialGroup?: string;
  isActive?: boolean;
}

export const materialsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMaterials: builder.query<PaginatedResponse<Material>, MaterialsQueryParams>({
      query: (params: MaterialsQueryParams) => ({
        url: '/ops/materials',
        params,
      }),
      providesTags: (result: PaginatedResponse<Material> | undefined) =>
        result && result.data
          ? [
              ...result.data.map(({ id }) => ({
                type: 'Materials' as const,
                id,
              })),
              { type: 'Materials', id: 'LIST' },
            ]
          : [{ type: 'Materials', id: 'LIST' }],
    }),
    createMaterial: builder.mutation<Material, CreateMaterialRequest>({
      query: (body: CreateMaterialRequest) => ({
        url: '/ops/materials',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Materials', id: 'LIST' }],
    }),
    getMaterialById: builder.query<Material, string | number>({
      query: (id: string | number) => `/ops/materials/${id}`,
      providesTags: (_result: Material | undefined, _error: unknown, id: string | number) => [
        { type: 'Materials', id },
      ],
    }),
    updateMaterial: builder.mutation<
      Material,
      { id: string | number; body: Partial<CreateMaterialRequest> }
    >({
      query: ({ id, body }: { id: string | number; body: Partial<CreateMaterialRequest> }) => ({
        url: `/ops/materials/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (
        result: Material | undefined,
        error: unknown,
        { id }: { id: string | number }
      ) => [
        { type: 'Materials', id },
        { type: 'Materials', id: 'LIST' },
      ],
    }),
    deleteMaterial: builder.mutation<void, string | number>({
      query: (id: string | number) => ({
        url: `/ops/materials/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Materials', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetMaterialsQuery,
  useCreateMaterialMutation,
  useGetMaterialByIdQuery,
  useUpdateMaterialMutation,
  useDeleteMaterialMutation,
} = materialsApi;

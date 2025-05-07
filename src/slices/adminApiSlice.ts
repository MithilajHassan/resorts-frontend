import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { CategoryDetails, FacilityDetails, IBanner, ICoupon, IResort, IUser } from "../types/types"

export const adminApi = createApi({
    reducerPath: 'adminApi',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BACKEND_URL+'/api', credentials: 'include' }),
    endpoints: (builder) => ({

        //------------------------ Category Management-----------------------------//

        addCategory: builder.mutation({
            query: (data: { category: string }) => ({
                url: '/admin/categories',
                method: 'POST',
                body: data
            })
        }),

        listCategories: builder.query<CategoryDetails[], void>({
            query: () => ({
                url: '/admin/categories'
            })
        }),

        deleteCategory: builder.mutation({
            query: (data: { id: unknown }) => ({
                url: `/admin/categories/${data.id}/soft-delete`,
                method: 'PATCH',
                body: data
            })
        }),

        updateCategory: builder.mutation({
            query: (data: { id: unknown, category: string }) => ({
                url: `/admin/categories/${data.id}`,
                method: 'PUT',
                body: { category: data.category }
            })
        }),

        //--------------------------- Facility Management ----------------------------//

        addFacility: builder.mutation({
            query: (data: { facilityName: string; }) => ({
                url: '/admin/facilities',
                method: 'POST',
                body: data
            })
        }),

        listFacilities: builder.query<FacilityDetails[], void>({
            query: () => ({
                url: '/admin/facilities'
            })
        }),

        deleteFacility: builder.mutation({
            query: (id: string) => ({
                url: `/admin/facilities/${id}/soft-delete`,
                method: 'PATCH',
            })
        }),

        updateFacility: builder.mutation({
            query: (data: { id: string, facilityName: string }) => ({
                url: `/admin/facilities/${data.id}`,
                method: 'PUT',
                body: { facilityName: data.facilityName }
            })
        }),


        //------------------------- Resort Management -------------------------------//

        getResorts: builder.query<IResort[],void>({
            query: () => '/admin/resorts',
        }),

        getResortDetails: builder.query<IResort, string>({
            query: (id: string) => ({
                url: `/admin/resortdetails/${id}`
            })
        }),

        acceptResort: builder.mutation<{success: boolean,resort:IResort},string>({
            query: (resortId) => ({
                url: `admin/resorts/${resortId}/accept`,
                method: 'PATCH',
            })
        }),

        rejectResort: builder.mutation<{success: boolean,resort:IResort},{ resortId: string, reason: string }>({
            query: (data) => ({
                url: `admin/resorts/${data.resortId}/reject`,
                method: 'PATCH',
                body: { reason: data.reason }
            })
        }),

        manageBlockUnblockResort: builder.mutation<{success: boolean,resort:IResort},{ id: string, status: boolean }>({
            query: (data) => ({
                url: `/admin/resorts/${data.id}/manage-block`,
                method: "PATCH",
                body: { status: data.status }
            })
        }),

        //--------------------------- User Management -----------------------------//

        listUsers: builder.query<IUser[], void>({
            query: () => '/admin/users',
        }),

        manageBlockUnblockUser: builder.mutation({
            query: (data: { id: string, status: boolean }) => ({
                url: `/admin/users/${data.id}/manage-block`,
                method: "PATCH",
                body: { status: data.status }
            })
        }),


        //--------------------- Banner Management---------------------//

        listBanners: builder.query<IBanner[], void>({
            query: () => '/admin/banners',
        }),
        createBanner: builder.mutation<IBanner, IBanner>({
            query: (bannerData) => ({
                url: '/admin/banners',
                method: 'POST',
                body: bannerData,
            }),
        }),
        editBanner: builder.mutation<IBanner,IBanner>({
            query: (data) => ({
                url: `/admin/banners/${data._id}`,
                method: 'PUT',
                body:data
            }),
        }),
        deleteBanner: builder.mutation<{message:string},string>({
            query: (bannerId) => ({
                url: `/admin/banners/${bannerId}`,
                method: 'DELETE',
            }),
        }),

        //--------------------- Coupon Management---------------------//
        listCoupons: builder.mutation<{success:boolean, data:ICoupon[]}, void>({
            query: () => ({
                url: '/admin/coupons',
                method: 'GET',
            }),
        }),
        createCoupon: builder.mutation<{success:boolean, data:ICoupon}, ICoupon>({
            query: (couponData) => ({
                url: '/admin/coupons',
                method: 'POST',
                body: couponData,
            }),
        }),
        deleteCoupon: builder.mutation<{success:boolean, message:string},string>({
            query: (id) => ({
                url: `/admin/coupons/${id}`,
                method: 'PATCH',
            }),
        }),

        getChartDetails: builder.mutation <{resort:string,bookings:number}[],void>({
            query:()=>({
                url:`/admin/dashboard`,
                method:'GET'
            })
        }),
        getTailsDetails: builder.mutation <{users:number,resorts:number,bookings:number,revenue:number,resortRevenue:number},void>({
            query:()=>({
                url:`/admin/dashboard/tails`,
                method:'GET'
            })
        })

    })
})

export const {
    useAddCategoryMutation,
    useListCategoriesQuery,
    useDeleteCategoryMutation,
    useUpdateCategoryMutation,
    useAddFacilityMutation,
    useUpdateFacilityMutation,
    useDeleteFacilityMutation,
    useListFacilitiesQuery,
    useGetResortsQuery,
    useAcceptResortMutation,
    useRejectResortMutation,
    useListUsersQuery,
    useManageBlockUnblockUserMutation,
    useManageBlockUnblockResortMutation,
    useListBannersQuery,
    useCreateBannerMutation,
    useEditBannerMutation,
    useDeleteBannerMutation,
    useListCouponsMutation,
    useCreateCouponMutation,
    useDeleteCouponMutation,
    useGetChartDetailsMutation,
    useGetTailsDetailsMutation,
    useGetResortDetailsQuery,


} = adminApi
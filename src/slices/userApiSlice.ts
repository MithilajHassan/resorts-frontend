import { CategoryDetails, FacilityDetails, IBanner, IBooking, IConversation, ICoupon, IMessage, IResort, IReview, IWalletHistory, IWishlist, SearchRoomsResult } from '../types/types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ResortQuery } from './searchSlice';

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://luminova.fun/api', credentials: 'include' }),
    endpoints: (builder) => ({

        updateUser: builder.mutation<{ id: string, name: string, email: string, phone: number, avatar?: string }, { id: string, name: string, phone: number, avatar?: string }>({
            query: ({ id, name, phone, avatar }) => ({
                url: `/user/update/${id}`,
                method: 'PATCH',
                body: { name, phone, avatar }
            })
        }),    

        updatePassword: builder.mutation<{ success: string },{ id: string, currPassword: string, newPassword: string }>({
            query: ({ id, currPassword, newPassword }) => ({
                url: `/user/updatepassword/${id}`,
                method: 'PATCH',
                body: { currPassword, newPassword }
            })
        }),         

        listResorts: builder.query<IResort[], void>({
            query: () => '/user/resorts',
        }),

        resortDetails: builder.query<IResort, string>({
            query: (id: string) => `/user/resorts/${id}`
        }),

        searchRooms: builder.mutation<SearchRoomsResult,{page:number, query:ResortQuery}>({
            query: (data) => ({
                url: '/user/search-resort',
                method: 'GET',
                params: {
                    page:data.page,
                    ...data.query
                }
            })
        }),

        listCategories: builder.query<CategoryDetails[], void>({
            query: () => ({
                url: '/user/categories'
            }),
        }),

        listFacilities: builder.query<FacilityDetails[], void>({
            query: () => ({
                url: '/user/facilities'
            }),
        }),

        createBooking: builder.mutation<{ orderId?: string, amount?: string | number, bookingId: string }, IBooking>({
            query: (data) => ({
                url: '/user/checkout',
                method: 'POST',
                body: data
            })
        }),
        setPaymentStatus: builder.mutation<{ success: boolean }, { bookingId: string, status: boolean }>({
            query: (data) => ({
                url: '/user/paymentstatus',
                method: 'PATCH',
                body: data
            })
        }),
        listBookings: builder.query<{ bookings: IBooking[] }, string>({
            query: (userId) => `/user/bookings/${userId}`
        }),
        editBookingStatus: builder.mutation<{ booking: IBooking }, { id: string, status: string }>({
            query: ({ id, status }) => ({
                url: `/user/bookings/${id}`,
                method: 'PATCH',
                body: { status: status }
            })
        }),

        createReview: builder.mutation<{ review: IReview }, IReview>({
            query: (data) => ({
                url: `/user/reviews`,
                method: 'POST',
                body: data
            })
        }),
        listReviews: builder.query<{ reviews: IReview[] }, string>({
            query: (id) => `/user/reviews/${id}`
        }),


        listWishlist: builder.query<{ wishlist: IWishlist[] }, string>({
            query: (userId) => `/user/wishlist/${userId}`,
        }),
        createWishlist: builder.mutation<IWishlist, IWishlist>({
            query:(data)=>({
                url:`/user/wishlist`,
                method:'POST',
                body:data
            })
        }),
        deleteWishlist: builder.mutation<{message:string,success:boolean}, {id:string}>({
            query:(data)=>({
                url:`/user/wishlist`,
                method:'DELETE',
                body:data
            })
        }),

        //--------------------- Banner Management---------------------//

        listBanners: builder.query<IBanner[], void>({
            query: () => '/user/banners',
        }),


        listCoupons: builder.mutation<{success:Boolean,data:ICoupon[]}, {price:number}>({
            query: ({price}) =>({
                url:`/user/coupons?price=${price}`,
                method:'GET'
            }) 
        }),

        applyCoupon: builder.mutation<{success:Boolean}, {userId:string,couponId:string}>({
            query: (data) =>({
                url:`/user/coupons`,
                method:'POST',
                body:data
            }) 
        }),

        getWallet: builder.query<{balance:number,histories:IWalletHistory[]},void>({
            query:()=>`/user/wallet`,
        }),

        //--------------------- Message Management---------------------//

        sendMessage: builder.mutation<IMessage, IMessage>({
            query: (data) =>({
                url:`/user/messages`,
                method:'POST',
                body:data
            }) 
        }),

        getMessages: builder.mutation<IConversation, string>({
            query: (id) =>({
                url:`/user/messages/${id}`,
                method:'GET'
            }) 
        }),

        getReceivers: builder.mutation<IConversation[], void>({
            query: () =>({
                url:`/user/messages/receivers`,
                method:'GET'
            }) 
        }),

    })
})

export const {
    useListResortsQuery,
    useResortDetailsQuery,
    useSearchRoomsMutation,
    useCreateBookingMutation,
    useSetPaymentStatusMutation,
    useListCategoriesQuery,
    useListFacilitiesQuery,
    useListBookingsQuery,
    useEditBookingStatusMutation,
    useUpdateUserMutation,
    useUpdatePasswordMutation,
    useCreateReviewMutation,
    useListReviewsQuery,
    useListWishlistQuery,
    useCreateWishlistMutation,
    useDeleteWishlistMutation,
    useListBannersQuery,
    useListCouponsMutation,
    useApplyCouponMutation,
    useGetWalletQuery,
    useSendMessageMutation,
    useGetReceiversMutation,
    useGetMessagesMutation,


} = userApi
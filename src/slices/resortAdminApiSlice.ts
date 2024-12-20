import { CategoryDetails, FacilityDetails, IBooking, IConversation, IMessage, IResort, IRoom } from '../types/types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const resortAdminApi = createApi({
    reducerPath: 'resortAdminApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Rooms'],
    endpoints: (builder) => ({

        listCategories: builder.query<CategoryDetails[], void>({
            query: () => ({
                url: '/resort/categories'
            }),
        }),

        listFacilities: builder.query<FacilityDetails[], void>({
            query: () => ({
                url: '/resort/facilities'
            }),
        }),

        getMyResort: builder.query<IResort, string>({
            query: (id: string) => ({
                url: `/resort/myresort/${id}`
            })
        }),

        editResort: builder.mutation<{ success: Boolean, data: IResort }, { resortData: IResort, id: string }>({
            query: (data) => ({
                url: `/resort/myresort/${data.id}`,
                method: 'PUT',
                body: data.resortData
            }),
        }),


        listRooms: builder.query<IRoom[], string>({
            query: (resortId: string) => ({
                url: `/resort/rooms/${resortId}`
            }),
            providesTags: ['Rooms']
        }),

        getRoom: builder.query<IRoom, string>({
            query: (id: string) => ({
                url: `/resort/rooms/detail/${id}`
            }),
            providesTags: ['Rooms']
        }),

        addRoom: builder.mutation({
            query: (data: IRoom) => ({
                url: `/resort/rooms`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Rooms']
        }),

        editRoom: builder.mutation({
            query: (data: { roomData: IRoom, id: string }) => ({
                url: `/resort/rooms/${data.id}`,
                method: 'PUT',
                body: data.roomData
            }),
            invalidatesTags: ['Rooms']
        }),

        deleteRoom: builder.mutation({
            query: (id: string) => ({
                url: `/resort/rooms/${id}/delete`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Rooms']
        }),

        listBookings: builder.query<{ bookings: IBooking[] }, string>({
            query: (resortId) => `/resort/bookings/${resortId}`
        }),
        editBookingStatus: builder.mutation<{ booking: IBooking }, { id: string, status: string }>({
            query: ({ id, status }) => ({
                url: `/resort/bookings/${id}`,
                method: 'PATCH',
                body: { status: status }
            })
        }),


        getChartDetails: builder.mutation<{ day: number, count: number }[], { resortId: string }>({
            query: ({ resortId }) => ({
                url: `/resort/dashboard/${resortId}`,
                method: 'GET'
            })
        }),
        getTailsDetails: builder.mutation<{ rooms: number, stays: number, bookings: number, revenue: number }, { resortId: string }>({
            query: ({ resortId }) => ({
                url: `/resort/dashboard/tails/${resortId}`,
                method: 'GET'
            })
        }),

        //--------------------- Message Management---------------------//

        sendMessage: builder.mutation<IMessage, IMessage>({
            query: (data) => ({
                url: `/resort/messages`,
                method: 'POST',
                body: data
            })
        }),

        getMessages: builder.mutation<IConversation, string>({
            query: (id) => ({
                url: `/resort/messages/${id}`,
                method: 'GET'
            })
        }),

        getReceivers: builder.mutation<IConversation[], void>({
            query: () => ({
                url: `/resort/messages/receivers`,
                method: 'GET'
            })
        }),


    })
})

export const {

    useListCategoriesQuery,
    useListFacilitiesQuery,
    useGetMyResortQuery,
    useEditResortMutation,
    useListRoomsQuery,
    useGetRoomQuery,
    useAddRoomMutation,
    useDeleteRoomMutation,
    useEditRoomMutation,
    // useVerifyAdminQuery,
    useListBookingsQuery,
    useEditBookingStatusMutation,
    useGetTailsDetailsMutation,
    useGetChartDetailsMutation,
    useSendMessageMutation,
    useGetReceiversMutation,
    useGetMessagesMutation,



} = resortAdminApi
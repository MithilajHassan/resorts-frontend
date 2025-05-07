import { IResort } from '@/types/types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BACKEND_URL+'/api', credentials: 'include' }),
    endpoints: (builder) => ({

        signup: builder.mutation({
            query: (email: string) => ({
                url: `/user/signup`,
                method: 'POST',
                body: { email }
            })
        }),

        verifyOtp: builder.mutation({
            query: (data: { otp: string, name: string, email: string, password: string }) => ({
                url: `/user/verify-otp`,
                method: 'POST',
                body: data
            })
        }),

        resendOtp: builder.mutation({
            query: (email: string) => ({
                url: `/user/resend-otp`,
                method: 'POST',
                body: { email }
            })
        }),

        signin: builder.mutation({
            query: (data: { email: string, password: string, role: string }) => ({
                url: `/user/signin`,
                method: 'POST',
                body: data
            })
        }),

        signoutUser: builder.mutation({
            query: () => ({
                url: `/user/signout`,
                method: 'POST',
            })
        }),

        getUser: builder.query({
            query: () => ({
                url: '/user/verifyuser',
                method: 'GET',
            })
        }),


        adminSignin: builder.mutation({
            query: (data: { email: string, password: string, role: string }) => ({
                url: `/admin/signin`,
                method: 'POST',
                body: data
            })
        }),

        signoutAdmin: builder.mutation({
            query: () => ({
                url: `/admin/signout`,
                method: 'POST',
            })
        }),
        
        
        
        registerResort: builder.mutation({
            query: (resortData: IResort) => ({
                url: '/resort/register',
                method: 'POST',
                body: resortData,
            }),
        }),

        resortSignin: builder.mutation({
            query: (data: { email: string, password: string }) => ({
                url: `/resort/signin`,
                method: 'POST',
                body: data
            })
        }),
        
        signoutResortAdmin: builder.mutation({
            query: () => ({
                url: `/resort/signout`,
                method: 'POST',
            })
        }),
        

    })
})

export const {
    useSignupMutation,
    useGetUserQuery,
    useVerifyOtpMutation,
    useResendOtpMutation,
    useSigninMutation,
    useSignoutUserMutation,
    useSignoutAdminMutation,
    useSignoutResortAdminMutation,
    useRegisterResortMutation,
    useResortSigninMutation,
    useAdminSigninMutation,

} = authApi
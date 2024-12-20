import { IBooking } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CheckoutState {
    checkoutDetails: IBooking | null;
}

const initialState: CheckoutState = {
    checkoutDetails: null,
}

const bookingSlice = createSlice({
    name:'checkout',
    initialState,
    reducers:{
        setCheckout:(state,action: PayloadAction<IBooking>) => {
            state.checkoutDetails = action.payload
        },
        // editCheckout:(state,action: PayloadAction<IBooking>) => {
        //     state.checkoutDetails = {...state.checkoutDetails,...action.payload}
        // },
        clearCheckout:(state) => {
            state.checkoutDetails = null
        }
    }
})

export default bookingSlice.reducer

export const { setCheckout, clearCheckout } = bookingSlice.actions
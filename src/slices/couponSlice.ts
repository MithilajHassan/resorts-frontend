import { ICoupon } from '../types/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';



interface CouponState {
  coupons: ICoupon[]
}

const initialState: CouponState = {
  coupons: [],
};

const couponSlice = createSlice({
  name: 'coupon',
  initialState,
  reducers: {
    setCoupon: (state, action: PayloadAction<ICoupon[]>) => {
      state.coupons = action.payload;
    },
    addCoupon: (state, action: PayloadAction<ICoupon>) => {
        state.coupons.push(action.payload);
    },
    editOneCoupon: (state, action: PayloadAction<ICoupon>) => {
        const index = state.coupons.findIndex((coupon) => coupon._id === action.payload._id);
        if (index !== -1) {
            state.coupons[index] = { ...state.coupons[index], ...action.payload };
        }
    },
    deleteOneCoupon: (state, action) => {
        state.coupons = state.coupons.filter((coupon) => coupon._id !== action.payload);
    },
  },
})

export const {
    setCoupon, 
    addCoupon,
    editOneCoupon,
    deleteOneCoupon

} = couponSlice.actions

export default couponSlice.reducer


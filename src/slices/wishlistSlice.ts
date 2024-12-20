import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IWishlist } from '../types/types';

interface WishlistState {
    wishlist: IWishlist[];
}

const initialState: WishlistState = {
    wishlist: []
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        setWishlist: (state, action: PayloadAction<IWishlist[]>) => {
            state.wishlist = action.payload;
        },
        addToWishlist: (state, action: PayloadAction<IWishlist>) => {
            state.wishlist.push(action.payload);
        },
        deleteWishlist: (state, action: PayloadAction<string>) => {
            if(state.wishlist){
                state.wishlist= state.wishlist.filter((item)=>item._id != action.payload)
            }
        },
    },
});

export const { setWishlist,addToWishlist,deleteWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

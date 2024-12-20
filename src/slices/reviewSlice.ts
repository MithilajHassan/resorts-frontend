import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IReview } from '../types/types'; 

interface ReviewState {
  reviews: IReview[];
}

const initialState: ReviewState = {
  reviews: [],
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    setReviews(state, action: PayloadAction<IReview[]>) {
      state.reviews = action.payload;
    },
    clearReviews(state) {
      state.reviews = [];
    },
  },
});

export const { setReviews, clearReviews } = reviewSlice.actions;

export default reviewSlice.reducer;

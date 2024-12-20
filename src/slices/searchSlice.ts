import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ResortQuery {
  place: string;
  guestCount: number | null;
  checkIn: string;
  checkOut: string;
  sortBy?: string;      
  categories?: string[]; 
  facilities?: string[]; 
  minPrice?: number;     
  maxPrice?: number; 
}

interface SearchState {
  search: ResortQuery
}

const initialState: SearchState = {
  search: {
    place: '',
    guestCount: null,
    checkIn: '',
    checkOut: '',
  }
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchParams: (state, action: PayloadAction<ResortQuery>) => {
      state.search = action.payload
    },
  },
});

export const { setSearchParams } = searchSlice.actions;
export default searchSlice.reducer;

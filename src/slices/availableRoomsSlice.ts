import { SearchRoomsResult } from '../types/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: SearchRoomsResult = {
  availableRooms: [],
  totalResorts: 0
}

const availableRoomsSlice = createSlice({
  name: 'availableRooms',
  initialState,
  reducers: {
    setAvailableRooms: (
      state,
      action: PayloadAction<SearchRoomsResult>
    ) => {
      state.availableRooms = action.payload.availableRooms;
      state.totalResorts = action.payload.totalResorts;
    },
  },

})

export const {
  setAvailableRooms,

} = availableRoomsSlice.actions

export default availableRoomsSlice.reducer;

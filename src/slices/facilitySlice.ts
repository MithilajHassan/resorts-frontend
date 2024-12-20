import { FacilityDetails } from '../types/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface FacilityState {
    facilities: FacilityDetails[] | null;
}

const initialState: FacilityState = {
    facilities: null,
}

const facilitySlice = createSlice({
    name: 'facilities',
    initialState,
    reducers: {
        setFacilities: (state, action: PayloadAction<FacilityDetails[]>) => {
            state.facilities = action.payload;
        },
        addOneFacility: (state, action: PayloadAction<FacilityDetails>) => {
            if (state.facilities) {
                state.facilities.push(action.payload);
            } else {
                state.facilities = [action.payload];
            }
        },
        updateOneFacility: (state, action: PayloadAction<FacilityDetails>) => {
            if (state.facilities) {
                const index = state.facilities.findIndex(facility => facility._id === action.payload._id)
                if (index !== -1) {
                    state.facilities[index] = action.payload
                }
            }
        },
        deleteOneFacility: (state, action: PayloadAction<string>) => {
            if (state.facilities) {
                state.facilities = state.facilities.filter(facility => facility._id !== action.payload);
            }
        },
    },
});

export const {
    setFacilities,
    addOneFacility,
    updateOneFacility,
    deleteOneFacility,
    
} = facilitySlice.actions;

export default facilitySlice.reducer;

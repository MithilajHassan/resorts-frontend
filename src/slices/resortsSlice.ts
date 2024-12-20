import { IResort } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface ResortsState {
    resorts:IResort[] | []
}

const initialState: ResortsState = {
    resorts: []
} 

const resortSlice = createSlice({
    name:'Resorts',
    initialState,
    reducers:{
        SetResorts: (state, action: PayloadAction<IResort[]>) => {
            state.resorts = action.payload
        },
        editResort: (state, action: PayloadAction<IResort>) => {
            const index = state.resorts.findIndex((resort) => resort._id === action.payload._id);
            if (index !== -1) {
                state.resorts[index] = { ...state.resorts[index], ...action.payload };
            }
        }
    }
})

export const { SetResorts, editResort } = resortSlice.actions
export default resortSlice.reducer
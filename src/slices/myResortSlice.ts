import { IResort } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ResortState {
    resort: IResort | null;
}

const initialState: ResortState = {
    resort: null
}

const myResort = createSlice({
    name: 'myResort',
    initialState,
    reducers: {
        setMyResort:(state,action:PayloadAction<IResort>)=>{
            state.resort = action.payload
        },
        editMyResort:(state,action:PayloadAction<IResort>)=>{
            state.resort = {...state.resort, ...action.payload}
        }
    }
})

export default myResort.reducer

export const {
    setMyResort,
    editMyResort,

} = myResort.actions
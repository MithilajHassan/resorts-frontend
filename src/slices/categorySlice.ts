import { CategoryDetails } from '../types/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CategoryState {
    categories: CategoryDetails[] | null;
}

const initialState: CategoryState = {
    categories: null,
}

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        setCategories: (state, action: PayloadAction<CategoryDetails[]>) => {
            state.categories = action.payload;
        },
        addOneCategory: (state, action: PayloadAction<CategoryDetails>) => {
            if (state.categories) {
                state.categories.push(action.payload)
            } else {
                state.categories = [action.payload]
            }
        },
        updateOneCategory: (state, action: PayloadAction<CategoryDetails>) => {
            if (state.categories) {
                const index = state.categories.findIndex(category => category._id === action.payload._id)
                if (index !== -1) {
                    state.categories[index] = action.payload
                }
            }
        },
        deleteOneCategory: (state, action: PayloadAction<string>) => {
            if (state.categories) {
                state.categories = state.categories.filter(category => category._id != action.payload)
            }
        },
    },
});

export const {
    setCategories,
    addOneCategory,
    updateOneCategory,
    deleteOneCategory,

} = categorySlice.actions;
export default categorySlice.reducer;

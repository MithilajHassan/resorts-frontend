import { IUser } from '../types/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface UserState {
    users: IUser[] | null;
}

const initialState: UserState = {
    users: null,
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUsers: (state, action: PayloadAction<IUser[]>) => {
            state.users = action.payload;
        },
        setBlockStatus: (state, action: PayloadAction<{ id: string; status: boolean }>) => {
            if (state.users) {
                state.users = state.users.map(user =>
                    user._id === action.payload.id
                        ? { ...user, isBlock: action.payload.status }
                        : user
                )
            }
        },
    },
})

export const { setUsers, setBlockStatus } = userSlice.actions;

export default userSlice.reducer;

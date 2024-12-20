import { ApiError } from "@/types/types";
import { userApi } from "../slices/userApiSlice"
import { isRejectedWithValue, Middleware } from "@reduxjs/toolkit"
import { clearUserAuth } from "../slices/authSlice";

interface MetaArgType {
    endpointName: string;
}

const userApiErrorMiddleware: Middleware = ({dispatch}) => next => action =>{
    if(isRejectedWithValue(action) && (action.meta.arg as MetaArgType)?.endpointName in userApi.endpoints){
        if((action.payload as ApiError)?.status == 401){
            dispatch(clearUserAuth())
        }
    }
    return next(action)
}

export default userApiErrorMiddleware
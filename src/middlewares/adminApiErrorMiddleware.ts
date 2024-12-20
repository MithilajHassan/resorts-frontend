import { ApiError } from "@/types/types";
import { adminApi } from "../slices/adminApiSlice"
import { isRejectedWithValue, Middleware } from "@reduxjs/toolkit"
import { clearAdminAuth } from "../slices/authSlice";

interface MetaArgType {
    endpointName: string;
}

const adminApiErrorMiddleware: Middleware = ({dispatch}) => next => action =>{
    if(isRejectedWithValue(action) && (action.meta.arg as MetaArgType)?.endpointName in adminApi.endpoints){
        if((action.payload as ApiError)?.status == 401){
            dispatch(clearAdminAuth())
        }
    }
    return next(action)
}

export default adminApiErrorMiddleware
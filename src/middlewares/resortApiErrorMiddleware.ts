import { ApiError } from "@/types/types";
import { isRejectedWithValue, Middleware } from "@reduxjs/toolkit"
import { clearResortAdminAuth } from "../slices/authSlice";
import { resortAdminApi } from "../slices/resortAdminApiSlice";

interface MetaArgType {
    endpointName: string;
}

const resortApiErrorMiddleware: Middleware = ({dispatch}) => next => action =>{
    if(isRejectedWithValue(action) && (action.meta.arg as MetaArgType)?.endpointName in resortAdminApi.endpoints){
        if((action.payload as ApiError)?.status == 401){
            dispatch(clearResortAdminAuth())
        }
    }
    return next(action)
}

export default resortApiErrorMiddleware
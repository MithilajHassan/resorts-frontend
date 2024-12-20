import { RootState } from '../../store'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

export default function PrivateRoute() {
    const { resortAdmin } = useSelector((state:RootState)=> state.auth)
  return resortAdmin ? <Outlet/> : <Navigate to="/resort/signin" />
}
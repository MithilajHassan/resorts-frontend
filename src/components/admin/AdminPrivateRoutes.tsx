import { RootState } from '../../store'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

export default function PrivateRoute() {
  const { adminInfo } = useSelector((state: RootState) => state.auth)
  return adminInfo ? <Outlet /> : <Navigate  to="/admin/signin" />
}
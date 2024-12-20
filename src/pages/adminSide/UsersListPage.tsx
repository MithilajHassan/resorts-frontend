import { useSelector } from "react-redux"
import { RootState } from "../../store"
import { FaUsers } from "react-icons/fa"
import { FaBox } from "react-icons/fa6"
import { Link } from "react-router-dom"
import { MdOutlineCategory, MdOutlineDashboard } from "react-icons/md"
import { GiBlockHouse } from "react-icons/gi"
import Sidebar, { SidebarItem } from '../../components/common/Sidebar'
import AdminHeader from "../../components/admin/AdminHeader"
import UsersList from "../../components/admin/UsersList"
import { HiMiniRectangleStack } from "react-icons/hi2"
import { BiSolidCoupon } from "react-icons/bi"


const UsersListPage = ()=>{
    const { adminInfo } = useSelector((state: RootState) => state.auth)
    return (
        <>
            <AdminHeader />
            <div className="flex">
                <Sidebar adminName={adminInfo?.name!} adminEmail={adminInfo?.email!} >
                <Link to={'/admin/dashboard'}><SidebarItem icon={<MdOutlineDashboard/>} text="Dashboard" /></Link>
                <SidebarItem icon={<FaUsers/>} text="Users"  active={true} />
                <Link to={'/admin/resorts'}><SidebarItem icon={<GiBlockHouse/>} text="Resorts" /></Link>
                <Link to={'/admin/categories'}><SidebarItem icon={<MdOutlineCategory/>} text="Categories" /></Link>
                <Link to={'/admin/facilities'}><SidebarItem icon={<FaBox />} text="Facilities" /></Link>
                <Link to={'/admin/banners'}><SidebarItem icon={<HiMiniRectangleStack />} text="Banners" /></Link>
                <Link to={'/admin/coupons'}><SidebarItem icon={<BiSolidCoupon />} text="Coupons" /></Link>
            </Sidebar>

            <UsersList/>
            
            </div>
        </>
    )
}

export default UsersListPage
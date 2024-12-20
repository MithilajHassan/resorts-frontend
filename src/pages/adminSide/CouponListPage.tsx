import { FaUsers } from "react-icons/fa"
import { FaBox } from "react-icons/fa6"
import { Link } from "react-router-dom"
import { MdOutlineCategory, MdOutlineDashboard } from "react-icons/md"
import { GiBlockHouse } from "react-icons/gi"
import { useSelector } from "react-redux"
import { RootState } from "../../store"
import { HiMiniRectangleStack } from "react-icons/hi2"
import { BiSolidCoupon } from "react-icons/bi";
import Sidebar, { SidebarItem } from '../../components/common/Sidebar'
import AdminHeader from "../../components/admin/AdminHeader"
import CouponList from "../../components/admin/CouponList"

export default function CouponListPage() {
    const { adminInfo } = useSelector((state: RootState) => state.auth)
    return (
        <>
            <AdminHeader />
            <div className="flex">
                <Sidebar adminName={adminInfo?.name!} adminEmail={adminInfo?.email!} >
                    <Link to={'/admin/dashboard'}><SidebarItem icon={<MdOutlineDashboard />} text="Dashboard" /></Link>
                    <Link to={'/admin/users'}><SidebarItem icon={<FaUsers />} text="Users" /></Link>
                    <Link to={'/admin/resorts'}><SidebarItem icon={<GiBlockHouse />} text="Resorts" /></Link>
                    <Link to={'/admin/categories'}><SidebarItem icon={<MdOutlineCategory />} text="Categories" /></Link>
                    <Link to={'/admin/facilities'}><SidebarItem icon={<FaBox />} text="Facilities" /></Link>
                    <Link to={'/admin/banners'}><SidebarItem icon={<HiMiniRectangleStack />} text="Banners" /></Link>
                    <SidebarItem icon={<BiSolidCoupon />} text="Coupons" active={true} />
                </Sidebar>

                <CouponList />

            </div>
        </>
  )
}
import { FaUsers } from "react-icons/fa"
import { GiBlockHouse } from "react-icons/gi"
import Sidebar, { SidebarItem } from '../../components/common/Sidebar'
import { MdOutlineCategory, MdOutlineDashboard } from "react-icons/md"
import AdminHeader from "../../components/admin/AdminHeader"
import { FaBox } from "react-icons/fa6"
import { Link } from "react-router-dom"
import { RootState } from "../../store"
import { useSelector } from "react-redux"
import { HiMiniRectangleStack } from "react-icons/hi2"
import { BiSolidCoupon } from "react-icons/bi"
import AdminTails from "../../components/admin/AdminTails"
import { ResortsChart } from "../../components/admin/ResortsChart"

const AdminDashboard = () => {
    const { adminInfo } = useSelector((state: RootState) => state.auth)
    return (
        <>
            <AdminHeader />
            <div className="flex">
                <Sidebar adminName={adminInfo?.name!} adminEmail={adminInfo?.email!} >
                    <SidebarItem icon={<MdOutlineDashboard />} text="Dashboard" active={true} />
                    <Link to={'/admin/users'}><SidebarItem icon={<FaUsers />} text="Users" /></Link>
                    <Link to={'/admin/resorts'}><SidebarItem icon={<GiBlockHouse />} text="Resorts" /></Link>
                    <Link to={'/admin/categories'}><SidebarItem icon={<MdOutlineCategory />} text="Categories" /></Link>
                    <Link to={'/admin/facilities'}><SidebarItem icon={<FaBox />} text="Facilities" /></Link>
                    <Link to={'/admin/banners'}><SidebarItem icon={<HiMiniRectangleStack />} text="Banners" /></Link>
                    <Link to={'/admin/coupons'}><SidebarItem icon={<BiSolidCoupon />} text="Coupons" /></Link>
                </Sidebar>

                <div className="flex flex-col items-center mt-20 w-full">
                    <AdminTails />
                    <div className="w-5/7 mt-5">
                        <ResortsChart />
                    </div>
                </div>
                
            </div>
        </>
    )
}

export default AdminDashboard
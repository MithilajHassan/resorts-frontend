import { Link } from 'react-router-dom'
import ResortHeader from '../../components/resort/Header'
import Sidebar, { SidebarItem } from '../../components/common/Sidebar'
import { MdOutlineBedroomParent, MdOutlineDashboard } from 'react-icons/md'
import { GiBlockHouse } from 'react-icons/gi'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { FaBook } from 'react-icons/fa'
import ResortTails from '../../components/resort/ResortTails'
import BookingTrendsChart from '../../components/resort/BookingChart'
import { FaMessage } from 'react-icons/fa6'

const ResortDashboard = () => {
    const { resortAdmin } = useSelector((state: RootState) => state.auth)
    return (
        <>
            <ResortHeader />
            <div className="flex">
                <Sidebar adminName={resortAdmin?.name!} adminEmail={resortAdmin?.email!} >
                    <SidebarItem icon={<MdOutlineDashboard />} text="Dashboard" active={true} />
                    <Link to={'/resort/myresort'}><SidebarItem icon={<GiBlockHouse />} text="My Resort" /></Link>
                    <Link to={'/resort/rooms'}><SidebarItem icon={<MdOutlineBedroomParent />} text="Rooms" /></Link>
                    <Link to={'/resort/bookings'}><SidebarItem icon={<FaBook />} text="Bookings" /></Link>
                    <Link to={'/resort/messages'}><SidebarItem icon={<FaMessage />} text="Messages" /></Link>
                </Sidebar>

                <div className="flex flex-col items-center mt-20 w-full">
                    <ResortTails />
                    <div className="w-8/12 mt-5">
                        <BookingTrendsChart />
                    </div>
                </div>

            </div>
        </>
    )
}

export default ResortDashboard
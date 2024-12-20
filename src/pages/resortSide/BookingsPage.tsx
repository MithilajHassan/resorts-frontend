import { Link } from 'react-router-dom'
import ResortHeader from '../../components/resort/Header'
import Sidebar, { SidebarItem } from '../../components/common/Sidebar'
import { MdOutlineBedroomParent, MdOutlineDashboard } from 'react-icons/md'
import { GiBlockHouse } from 'react-icons/gi'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { FaBook } from 'react-icons/fa'
import BookingsList from '../../components/resort/BookingsList'
import { FaMessage } from 'react-icons/fa6'


function BookingsPage() {
    const { resortAdmin } = useSelector((state: RootState) => state.auth)
    return (
        <>
            <ResortHeader />
            <div className="flex">
                <Sidebar adminName={resortAdmin?.name!} adminEmail={resortAdmin?.email!} >
                    <Link to={'/resort/dashboard'}><SidebarItem icon={<MdOutlineDashboard />} text="Dashboard" /></Link>
                    <Link to={'/resort/myresort'}><SidebarItem icon={<GiBlockHouse />} text="My Resort" /></Link>
                    <Link to={'/resort/rooms'}><SidebarItem icon={<MdOutlineBedroomParent />} text="Rooms" /></Link>
                    <SidebarItem icon={<FaBook />} text="Bookings" active={true} />
                    <Link to={'/resort/messages'}><SidebarItem icon={<FaMessage />} text="Messages" /></Link>
                </Sidebar>
                <div className="mt-16 w-full flex justify-center pt-4">
                    <BookingsList />
                </div>
            </div>

        </>
    )
}

export default BookingsPage
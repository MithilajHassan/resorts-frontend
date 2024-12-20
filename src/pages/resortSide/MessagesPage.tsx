import { Link } from 'react-router-dom'
import ResortHeader from '../../components/resort/Header'
import Sidebar, { SidebarItem } from '../../components/common/Sidebar'
import { MdOutlineBedroomParent, MdOutlineDashboard } from 'react-icons/md'
import { GiBlockHouse } from 'react-icons/gi'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { FaBook } from 'react-icons/fa'
import { FaMessage } from 'react-icons/fa6'
import Chats from '../../components/resort/Chats'

const ResortDashboard = () => {
    const { resortAdmin } = useSelector((state: RootState) => state.auth)
    return (
        <>
            <ResortHeader />
            <div className="flex">
                <Sidebar adminName={resortAdmin?.name!} adminEmail={resortAdmin?.email!} >
                    <Link to={'/resort/dashboard'}><SidebarItem icon={<MdOutlineDashboard />} text="Dashboard" /></Link>
                    <Link to={'/resort/myresort'}><SidebarItem icon={<GiBlockHouse />} text="My Resort" /></Link>
                    <Link to={'/resort/rooms'}><SidebarItem icon={<MdOutlineBedroomParent />} text="Rooms" /></Link>
                    <Link to={'/resort/bookings'}><SidebarItem icon={<FaBook />} text="Bookings" /></Link>
                    <Link to={'/resort/messages'}><SidebarItem icon={<FaMessage />} text="Messages" active={true} /></Link>
                </Sidebar>

                <div className="flex justify-end w-full">
                    <Chats />
                </div>

            </div>
        </>
    )
}

export default ResortDashboard
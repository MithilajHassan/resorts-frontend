import { FaBook, FaHeart, FaUserCircle, FaWallet } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import ProfileSidebar from '../../components/users/ProfileSidebar'
import UserHeader from '../../components/users/UserHeader'
import WalletCard from '../../components/users/WalletCard'
import WalletHistory from '../../components/users/WalletHistory'
import { useGetWalletQuery } from '../../slices/userApiSlice'



export default function WalletPage() {
    const { data } = useGetWalletQuery()
    return (
        <>
            <UserHeader />
            <div className="flex justify-center w-full mt-20 px-16 space-x-4">
                <div className="w-1/5 hidden md:block">
                    <ProfileSidebar>
                        <Link to={'/myprofile'}><li className="p-4 hover:bg-indigo-50"><span className="mx-auto flex items-center gap-2"><FaUserCircle />Profile</span></li></Link>
                        <Link to={'/bookings'}><li className="p-4 border-y hover:bg-indigo-50"><span className="mx-auto flex items-center gap-2"><FaBook />Bookings</span></li></Link>
                        <Link to={'/wishlist'}><li className="p-4 border-b hover:bg-indigo-50"><span className="mx-auto flex items-center gap-2"><FaHeart />Wishlist</span></li></Link>
                        <Link to={'/wallet'}><li className="p-4 bg-indigo-100 hover:bg-indigo-50"><span className="mx-auto flex items-center gap-2"><FaWallet />Wallet</span></li></Link>
                    </ProfileSidebar>
                </div>
                <div className="flex flex-grow">
                    <div className="w-full">
                        <div className='w-full flex justify-center my-12'>
                            <WalletCard  balance={data?.balance!} />
                        </div>
                        <div className='w-full flex'>
                            <WalletHistory histories={data?.histories} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
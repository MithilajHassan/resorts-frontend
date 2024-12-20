import { FaBook, FaHeart, FaUserCircle, FaWallet } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import ProfileSidebar from '../../components/users/ProfileSidebar'
import UserHeader from '../../components/users/UserHeader'
import WishlistCard from '../../components/users/wishlistCard'


export default function WishlistPage() {
    return (
        <>
            <UserHeader />
            <div className="flex justify-center w-full mt-20 px-16 space-x-4">
                <div className="w-1/5 hidden md:block">
                    <ProfileSidebar>
                        <Link to={'/myprofile'}><li className="p-4 hover:bg-indigo-50"><span className="mx-auto flex items-center gap-2"><FaUserCircle />Profile</span></li></Link>
                        <Link to={'/bookings'}><li className="p-4 border-y hover:bg-indigo-50"><span className="mx-auto flex items-center gap-2"><FaBook />Bookings</span></li></Link>
                        <Link to={'/wishlist'}><li className="p-4 border-b bg-indigo-100 hover:bg-indigo-50"><span className="mx-auto flex items-center gap-2"><FaHeart />Wishlist</span></li></Link>
                        <Link to={'/wallet'}><li className="p-4 hover:bg-indigo-50"><span className="mx-auto flex items-center gap-2"><FaWallet />Wallet</span></li></Link>
                    </ProfileSidebar>
                </div>
                <div className="flex flex-grow">
                    <WishlistCard />
                </div>
            </div>
        </>
    )
}
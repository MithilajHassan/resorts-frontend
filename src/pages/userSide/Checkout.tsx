import Bill from "../../components/users/checkout/Bill"
import BookingDetails from "../../components/users/checkout/BookingDetails"
import UserHeader from "../../components/users/UserHeader"
import GuestForm from "../../components/users/checkout/GuestForm"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import CouponSection from "../../components/users/checkout/CouponSection"


export default function Checkout() {
    const { checkoutDetails } = useSelector((state: RootState) => state.checkout)
    const { availableRooms } = useSelector((state: RootState) => state.availableRsorts)

    const resort = availableRooms.find((v) => v.resort._id == checkoutDetails?.resortId)
    const room = resort?.rooms.find((v) => v._id == checkoutDetails?.roomId)
    return (
        <>
            <UserHeader />
            <div className="flex flex-col space-y-2 p-4 mt-16">

                <div className="flex flex-col md:space-x-4 md:flex-row md:space-y-0 space-y-4 p-6">
                    <BookingDetails checkoutDetails={checkoutDetails!} resort={resort?.resort!} room={room!} />
                    <Bill checkoutDetails={checkoutDetails!} room={room!} />
                </div>

                <div className="flex flex-col md:flex-row space-y-4 md:space-x-4 md:space-y-0 px-6 ">

                    <GuestForm />

                    <div className="w-80 ">
                        <CouponSection checkoutDetails={checkoutDetails!} />
                    </div>

                </div>

            </div>
        </>

    )
}
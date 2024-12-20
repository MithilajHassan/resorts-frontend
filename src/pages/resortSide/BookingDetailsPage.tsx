import Bill from "../../components/users/checkout/Bill"
import BookingDetails from "../../components/users/checkout/BookingDetails"
import ResrotHeader from "../../components/resort/Header"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store"
import { useParams } from "react-router-dom"
import GuestDetails from "../../components/users/GuestDetails"
import { useEditBookingStatusMutation } from "../../slices/resortAdminApiSlice"
import { updateABookingStatus } from "../../slices/bookingSlice"
import { Button } from "../../components/ui/button"
import Confirm from "../../components/common/Confirm"



export default function BookingDetailsPage() {
    const { bookings } = useSelector((state: RootState) => state.bookings)
    const { id } = useParams()
    const bookingData = bookings?.find((value) => value._id == id)
    const [editBookingStatus] = useEditBookingStatusMutation()
    const dispatch = useDispatch<AppDispatch>()

    const stayedBooking = async () => {
        const res = await editBookingStatus({ id: id!, status: 'Stayed' }).unwrap()
        dispatch(updateABookingStatus(res.booking))
    }
    // const bookedBooking = async () => {
    //     const res = await editBookingStatus({ id: id!, status: 'Booked' }).unwrap()
    //     dispatch(updateOneBooking(res.booking))
    // }

    return (
        <>
            <ResrotHeader />
            <div className="flex flex-col space-y-2 p-4 mt-16">

                <div className="flex flex-col md:space-x-4 md:flex-row md:space-y-0 space-y-4 p-6">
                    {typeof bookingData?.resortId != 'string' && typeof bookingData?.roomId != 'string' &&
                        <BookingDetails checkoutDetails={bookingData!} resort={bookingData?.resortId!} room={bookingData?.roomId!} />
                    }
                    {typeof bookingData?.roomId != 'string' &&
                        <Bill checkoutDetails={bookingData!} room={bookingData?.roomId!} />
                    }
                </div>

                <div className="flex flex-col md:flex-row space-y-4 md:space-x-4 md:space-y-0 px-6 ">

                    <GuestDetails bookingDetails={bookingData!} />

                    <div className="w-80">
                        <p className="py-4 text-center md:text-lg font-semibold">Booking Status :
                            <span className={`${bookingData?.status === 'Cancelled' ? 'text-red-700' : 'text-blue-700'} ms-1 font-bold`}>
                                {bookingData?.status}
                            </span>
                        </p>
                        {
                            bookingData?.status === 'Booked' && (

                                <div className="flex justify-center w-full">
                                    <Confirm key={bookingData._id} id={id!} onConfirm={stayedBooking} action="change the status" >
                                        <Button
                                            className="w-52 bg-green-600 hover:bg-green-400 text-md"
                                            size={'lg'}
                                        >
                                            Stayed
                                        </Button>
                                    </Confirm>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
import { ToastContainer } from "react-toastify";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useListBookingsQuery } from "../../slices/resortAdminApiSlice";
import { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { setBookings } from "../../slices/bookingSlice";

export default function BookingsList() {
    const { resortAdmin } = useSelector((state: RootState) => state.auth)
    const { data } = useListBookingsQuery(resortAdmin?._id!)
    const { bookings } = useSelector((state: RootState) => state.bookings)
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        if (data && bookings === null) {
            dispatch(setBookings(data.bookings));
        }
    }, [data, bookings, dispatch])
    
    return (
        <div className="w-4/6 h-fit border-2 rounded-md" >
            <ToastContainer />
            <Table className="">
                <TableHeader className="bg-blue-100 text-black h-12">
                    <TableRow>
                        <TableHead className="text-black font-bold">Customers</TableHead>
                        <TableHead className="text-black font-bold">Room</TableHead>
                        <TableHead className="text-black font-bold">Checkin</TableHead>
                        <TableHead className="text-black font-bold">Price</TableHead>
                        <TableHead className="text-black font-bold">Status</TableHead>
                        <TableHead className="text-black font-bold text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {bookings?.length! > 0 ? (
                        bookings!.map((booking) => (
                            <TableRow className="h-10" key={booking._id} >
                                <TableCell className="">{booking.guestName}</TableCell>
                                <TableCell className="">{typeof booking.roomId != 'string' && booking.roomId.name}</TableCell>
                                <TableCell className="">{new Date(booking.checkInDate).toDateString()}</TableCell>
                                <TableCell className="text-green-800 font-bold">₹{typeof booking.roomId != 'string' && booking.totalPrice - 200}</TableCell>
                                <TableCell className={`font-semibold ${booking.status=='Cancelled'?'text-red-600':booking.status=='Booked'?'text-blue-800':'text-green-600'}`}>
                                    {booking.status}
                                </TableCell>
                                <TableCell className="text-end">
                                    <Link to={`/resort/bookings/${booking._id}`} key={booking._id} className="bg-blue-700 hover:bg-blue-400 py-1 px-2 rounded-sm text-sm text-white">View</Link>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">Bookings not found.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

import { useDispatch, useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { AppDispatch, RootState } from '../../store';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../ui/button';
import { FaUser } from 'react-icons/fa';
import { setCheckout } from '../../slices/checkoutSlice'


const AvailableRooms = () => {
    const { availableRooms } = useSelector((state: RootState) => state.availableRsorts)
    const { checkIn, checkOut, guestCount } = useSelector((state: RootState) => state.search.search)
    const { userInfo } = useSelector((state:RootState)=> state.auth)
    const { id } = useParams()
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const resortEntry = availableRooms.find(resortEntry => resortEntry.resort._id === id);

    const roomsForResort = resortEntry ? resortEntry.rooms : [];

    const onBooking = (roomId: string, price: number) => {
        dispatch(setCheckout({
            userId:userInfo?._id!,
            resortId:id!,
            roomId,
            guestName:userInfo?.name!,
            guestEmail:userInfo?.email!,
            guestPhone:userInfo?.phone!,
            guestCount:guestCount!,
            checkInTime:'1:00',
            checkOutTime:'10:00',
            checkInDate:new Date(checkIn),
            checkOutDate:new Date(checkOut),
            paymentMethod:'upi',
            totalPrice:price+200,
            discount:0,
        }))
        navigate('/checkout')
    }

    return (
        <div className="w-full mb-12 p-4 mx-auto">
            <h2 className="text-xl font-bold mb-4 text-center">Available Rooms</h2>
            <div className="border-2 border-gray-400 rounded-sm w-4/5 mx-auto">
                <Table className='w-full'>
                    <TableHeader className='bg-blue-100 text-black h-12 border-b-2 border-gray-400'>
                        <TableRow>
                            <TableHead className='text-black md:text-lg font-bold'>Room Type</TableHead>
                            <TableHead className='text-black md:text-lg font-bold'>Number of Guests</TableHead>
                            <TableHead className='text-black md:text-lg font-bold'>Price</TableHead>
                            <TableHead className='text-black md:text-lg font-bold'>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roomsForResort.length > 0 ? (
                            roomsForResort.map(room => (
                                <TableRow className='border-b-2 border-gray-400 md:text-lg' key={room._id}>
                                    <TableCell>{room.name}</TableCell>
                                    <TableCell>
                                        <span className="flex space-x-1">
                                            {[...Array(room.numberOfGuests)].map((_, i) => <FaUser key={i} />)}
                                        </span>
                                    </TableCell>
                                    <TableCell className='text-green-800 font-semibold'>
                                        <span className='text-red-600 text-sm line-through mr-1'>
                                            ₹{room.normalPrice}
                                        </span>
                                        ₹{room.offerPrice}
                                    </TableCell>
                                    <TableCell>
                                        <Button onClick={() => onBooking(room._id!,room.offerPrice!)} className='bg-blue-700 hover:bg-blue-400'>Book</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow className='border-b-2 border-gray-400'>
                                <TableCell colSpan={4} className="text-center text-blue-800 text-lg  font-bold">
                                    No rooms available.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AvailableRooms;

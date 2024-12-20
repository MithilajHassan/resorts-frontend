import { Card } from "../ui/card";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { useListBookingsQuery } from "../../slices/userApiSlice";
import { useEffect } from "react";
import { setBookings } from "../../slices/bookingSlice";
import { format } from 'date-fns';
import { Link } from "react-router-dom";


const BookingsCard: React.FC = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth)
  const { data } = useListBookingsQuery(userInfo?._id!)
  const { bookings } = useSelector((state: RootState) => state.bookings)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (data?.bookings) {
      dispatch(setBookings(data.bookings))

    } else {
      // alert('Internal server error')
    }
  }, [data])


  return (
    <div className="grow">
      <h1 className="text-2xl font-bold mb-5">Bookings</h1>
      {bookings?.length ? (bookings.map((booking) => (

        <Link to={`/bookings/${booking._id}`} key={booking._id}>
          <Card className="flex flex-col md:flex-row items-center p-4 shadow-md mb-2">

            <img
              src={typeof booking.resortId == 'string' ? '' : booking.resortId?.images[0]}
              alt="Resort"
              className="h-24 w-32 rounded-md object-cover mr-4"
            />

            <div className="flex flex-col flex-grow space-y-1">
              <h2 className="text-lg font-semibold text-gray-800">{typeof booking.resortId == 'string' ? '' : booking.resortId?.resortName}</h2>
              <p className="text-gray-600">{`
                ${format(booking.checkInDate, "dd-MM-yyyy")} - 
                ${format(booking.checkOutDate, "dd-MM-yyyy")}
              `}</p>
              <p className="text-sm font-medium">Status :
                <span className={`${booking?.status === 'Cancelled' ? 'text-red-700' : booking?.status === 'Stayed' ? 'text-green-700' : 'text-blue-700'} ml-1 font-bold`}>
                  {booking.status}
                </span>
              </p>
            </div>

            <div className="flex flex-col items-end ml-4 ">
              <span className="text-lg font-bold text-green-800">₹{booking.totalPrice}</span>
              {/* <Button
                  size={'sm'}
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-500 flex items-center space-x-1"
                >
                  Cancel
                </Button> */}
            </div>
          </Card>
        </Link>
      ))) : (
        <Card className="p-6 text-blue-800 text-xl font-bold">
          <p className="text-center">You have not booked yet</p>
        </Card>
      )}
    </div>
  );
};

export default BookingsCard;

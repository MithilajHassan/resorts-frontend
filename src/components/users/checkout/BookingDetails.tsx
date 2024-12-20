import { FaMapMarkerAlt, FaStar } from "react-icons/fa"
import { IBooking, IResort, IRoom } from "@/types/types"

type Props = {
  checkoutDetails: IBooking;
  resort: IResort;
  room: IRoom
}

export default function BookingDetails({ checkoutDetails, resort, room }: Props) {

  const checkInDate = checkoutDetails?.checkInDate ? new Date(checkoutDetails.checkInDate) : null;
  const checkOutDate = checkoutDetails?.checkOutDate ? new Date(checkoutDetails.checkOutDate) : null;

  const nightsCount = checkInDate && checkOutDate
    ? Math.round(Math.abs(checkInDate.getTime() - checkOutDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="w-full lg:w-4/5 space-y-4 shadow-md pb-4">

      <div className="border-b w-full py-2">
        <h2 className="text-xl font-semibold mx-8">Your booking details</h2>
      </div>

      <div className="flex px-4 mx-4">
        <div>
          <img src={resort.images[0]} alt="resort" className="rounded-md w-36 md:w-56 md:h-36" />
        </div>
        <div className="flex flex-col mx-3 space-y-2">

          <div className="flex space-x-1">
            <FaStar className="text-yellow-400 text-2xl" />
            <FaStar className="text-yellow-400 text-2xl" />
            <FaStar className="text-yellow-400 text-2xl" />
            <FaStar className="text-yellow-400 text-2xl" />
          </div>

          <h2 className="text-xl font-bold">{resort.resortName}</h2>
          <p className="flex items-center text-gray-600 text-md">
            <FaMapMarkerAlt className="mr-2 text-red-500" />
            {resort?.address}
          </p>
          {/* <div className="flex items-center text-gray-600 text-md text-wrap">
            <FaMapMarkerAlt className="mr-1 text-red-500" />
            <p className="break-words">{resort.address}</p>
          </div> */}
          <p className="px-2 bg-green-500 w-fit font-semibold">
            4.3
          </p>

        </div>
      </div>

      <div className="mx-8 space-y-2">
        <h3 className="text-xl font-semibold">{room?.name}</h3>
        <h2 className="text-md font-semibold">You selected 1 room for {checkoutDetails?.guestCount} adults</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-8 ">
        <div>
          <h3 className="text-xl font-semibold">Check-in</h3>
          <h2 className="text-sm font-semibold">{checkInDate!.toDateString()}</h2>
          <h2 className="text-sm font-semibold text-gray-500">from {checkoutDetails?.checkInTime}</h2>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Check-out</h3>
          <h2 className="text-sm font-semibold">{checkOutDate!.toDateString()}</h2>
          <h2 className="text-sm font-semibold text-gray-500">from {checkoutDetails?.checkOutTime}</h2>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Total length of stay</h3>
          <h2 className="text-sm font-semibold">{nightsCount > 1 ? nightsCount + " Night" : "1 Night"}</h2>
        </div>
      </div>
    </div>
  );
}


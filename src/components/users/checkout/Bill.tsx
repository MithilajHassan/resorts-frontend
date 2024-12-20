import { IBooking, IRoom } from "@/types/types";

type Props = {
    checkoutDetails:IBooking;
    room:IRoom;
  }

export default function Bill({ checkoutDetails, room }: Props) {

    return (
        <div className="w-full md:w-80 space-y-4 shadow-md ">
            <div className="border-b py-2 ps-4">
                <h2 className="text-xl font-semibold">Price Summary</h2>
            </div>
            <div className="space-y-4 border-b px-4 pb-4">

                <div className="flex justify-between text-md font-medium">
                    <span>Room Price</span>
                    <span>₹{room.normalPrice}</span>
                </div>

                <div className="flex justify-between text-md font-medium">
                    <span>Service Charges</span>
                    <span>₹200</span>
                </div>


                <div className="flex justify-between text-md font-medium text-green-700">
                    <span>Discount</span>
                    <span>-₹{Math.floor(room.normalPrice * room.offerPercentage /100)+checkoutDetails.discount!}</span>
                </div>
            </div>
            <div className="px-4 ">
                <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{checkoutDetails.totalPrice}</span>
                </div>
            </div>
        </div>
    );
}


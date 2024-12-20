import { Input } from "../ui/input"
import { IBooking } from "@/types/types"


type Props = {
    bookingDetails: IBooking;
}


export default function GuestDetails({ bookingDetails }: Props) {


    return (
        <div className="w-full  lg:w-4/5 space-y-2 shadow-md pb-4">

            <div className="border-b pb-2 ps-4">
                <h2 className="text-xl font-semibold">Guest details</h2>
            </div>

            <form className="p-4 space-y-4" >

                <div className="grid grid-cols-2 space-x-2">

                    <div>
                        <label>Guest Name</label>
                        <Input className="bg-indigo-50 focus-visible:ring-0" value={bookingDetails.guestName} readOnly={true} />
                    </div>

                    <div>
                        <label>Guest Email</label>
                        <Input className="bg-indigo-50 focus-visible:ring-0" value={bookingDetails.guestEmail} readOnly={true} />
                    </div>

                </div>

                <div>
                    <label>Guest Phone</label> 
                    <Input className="bg-indigo-50 focus-visible:ring-0" value={bookingDetails.guestPhone} readOnly={true} />
                </div>

            </form>

        </div>
    )
}

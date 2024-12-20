import UserHeader from "../../components/users/UserHeader"
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useNavigate } from 'react-router-dom';
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { format } from "date-fns";

const BookingSuccessPage: React.FC = () => {
    const { checkoutDetails } = useSelector((state: RootState) => state.checkout)
    const { availableRooms } = useSelector((state: RootState) => state.availableRsorts)

    const resort = availableRooms.find((v) => v.resort._id == checkoutDetails?.resortId)?.resort!
    const room = availableRooms.find((v) => v.resort._id == checkoutDetails?.resortId)?.rooms
    .find((v)=> v._id == checkoutDetails?.roomId)
    const navigate = useNavigate();
    const handleExploreMore = () => {
        navigate('/search')
    };

    return (
        <>
            <UserHeader />
            <div className="flex justify-center items-center min-h-screen bg-gray-100 pt-12">
                <Card className="max-w-lg w-full p-6 text-center animate-fadeIn">
                    <CardHeader className="flex flex-col items-center">
                        <CheckCircleIcon className="h-16 w-16 text-green-500 mb-4" />
                        <h1 className="text-2xl font-bold text-gray-800">Booking Confirmed!</h1>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full flex flex-col items-center">
                            <img src={resort.images[0]} alt="resort" className="rounded-md w-20 md:w-44 md:h-24" />
                            <h3 className="text-lg font-semibold">{resort.resortName}</h3>
                            <p>Room : {room?.name}</p>
                            <div className="flex">
                                <p className="tex-gray-700">Checkin:{format(checkoutDetails?.checkInDate!,"dd-MM-yyyy")} -</p>
                                <p className="tex-gray-700">- Checkout:{format(checkoutDetails?.checkOutDate!,"dd-MM-yyyy")}</p>
                            </div>
                        </div>
                        <p className="text-gray-600 my-3">
                            Thank you for booking with us! Your resort reservation is confirmed.
                            We look forward to welcoming you!
                        </p>
                        <Button
                            onClick={handleExploreMore}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-transform transform hover:scale-105"
                        >
                            Explore More Resorts
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default BookingSuccessPage;
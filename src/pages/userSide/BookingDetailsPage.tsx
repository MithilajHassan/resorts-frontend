import Bill from "../../components/users/checkout/Bill"
import BookingDetails from "../../components/users/checkout/BookingDetails"
import UserHeader from "../../components/users/UserHeader"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { useParams } from "react-router-dom"
import GuestDetails from "../../components/users/GuestDetails"
import { useEditBookingStatusMutation, useGetMessagesMutation, useSendMessageMutation } from "../../slices/userApiSlice"
import CancelConfirm from "../../components/common/CancelConfirm"
import { updateOneBooking } from "../../slices/bookingSlice"
import { Button } from "../../components/ui/button"
import WriteReview from "../../components/users/WriteReview"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { useEffect, useRef, useState } from "react"
import { IMessage } from "@/types/types"
import { io, Socket } from "socket.io-client"
import { format } from "date-fns"


export default function BookingDetailsPage() {
    const { bookings } = useSelector((state: RootState) => state.bookings)
    const { userInfo } = useSelector((state: RootState) => state.auth)
    const { id } = useParams()
    const bookingData = bookings?.find((value) => value._id == id)
    const [editBookingStatus] = useEditBookingStatusMutation()
    const [getMessges] = useGetMessagesMutation()
    const [sendMessage] = useSendMessageMutation()
    const dispatch = useDispatch()
    const [newMessageTxt, setNewMessageTxt] = useState<string>('')
    const [messages, setMessages] = useState<IMessage[]>([])
    const [socket, setSocket] = useState<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null)

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const newSocket = io(`${process.env.REACT_APP_BACKEND_URL}`, {
            query: { userId: userInfo?._id },
        });

        setSocket(newSocket);

        newSocket.on('connect', () => {
            newSocket.emit('joinRoom', userInfo?._id)
        })

        newSocket.on('receiveMessage', (message: IMessage) => {
            if (userInfo?._id == message.receiverId) {
                setMessages((prevMessages) => [...prevMessages, message]);
            }
        });

        return () => {
            newSocket.disconnect();
            setSocket(null)
        };
    }, [userInfo]);

    const cancelBooking = async () => {
        const res = await editBookingStatus({ id: id!, status: 'Cancelled' }).unwrap()
        dispatch(updateOneBooking(res.booking))
    }

    const getChats = async () => {
        try {
            const resortId = typeof bookingData?.resortId !== 'string' ? bookingData?.resortId._id! : ''
            const res = await getMessges(resortId).unwrap()
            if (res) {
                setMessages(res.messages)
            }
        } catch (err) {
        }
    }

    const sendMessageHandler = async () => {
        try {
            const res = await sendMessage({
                senderId: userInfo?._id!,
                senderType: 'User',
                receiverId: typeof bookingData?.resortId !== 'string' ? bookingData?.resortId._id! : '',
                receiverType: 'Resort',
                message: newMessageTxt,
            }).unwrap()
            if (res) {
                setMessages((prevMessages) => [...prevMessages, res]);
                setNewMessageTxt('');
                socket?.emit('sendMessage', res);
            }
        } catch (err) {
        }
    }

    return (
        <>
            <UserHeader />
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
                            <span className={`${bookingData?.status === 'Cancelled' ? 'text-red-700' : bookingData?.status === 'Stayed' ? 'text-green-700' : 'text-blue-700'} ms-1 font-bold`}>
                                {bookingData?.status}
                            </span>
                        </p>
                        {
                            bookingData?.status === 'Booked' && (
                                <div className="flex justify-center w-full">
                                    <CancelConfirm id={id!} onConfirm={cancelBooking} >
                                        <Button
                                            className="w-52 bg-red-600 hover:bg-red-400 text-md"
                                            size={'lg'}
                                        >
                                            Cancel
                                        </Button>
                                    </CancelConfirm>
                                </div>
                            )
                        }
                        {
                            bookingData?.status === 'Stayed' && (
                                <div className="flex justify-center w-full">
                                    <WriteReview userId={bookingData.userId} bookingId={bookingData._id!} resortId={typeof bookingData.resortId !== 'string' ? bookingData.resortId._id! : bookingData.resortId} />
                                </div>
                            )
                        }

                        {
                            bookingData?.status != 'Cancelled' && (
                                <Dialog>
                                    <DialogTrigger className="w-full">
                                        <Button className="place-content-center bg-blue-700 hover:bg-blue-400 font-bold mt-4" onClick={getChats}>Send Message</Button>
                                    </DialogTrigger>
                                    <DialogContent className="gap-0">
                                        <DialogHeader>
                                            <DialogTitle className="bg-blue-700 text-white mt-3 border-x border-t border-black py-3  ps-2">
                                                {typeof bookingData?.resortId !== 'string' && bookingData?.resortId.resortName}
                                            </DialogTitle>
                                        </DialogHeader>
                                        <div className="flex-1 flex flex-col border-x border-b border-black h-96">
                                            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
                                                {messages?.length ? messages.map((message) => (
                                                    <>
                                                        <div
                                                            key={message._id}
                                                            className={`max-w-xs p-2 rounded-lg text-white shadow-md ${message.senderType == 'User'
                                                                ? 'bg-blue-700 place-self-end'
                                                                : 'bg-blue-500 place-self-start'
                                                                }`}
                                                        >
                                                            {message.message}
                                                        </div>
                                                        <p
                                                            style={{ marginTop: "0" }}
                                                            className={`text-xs text-gray-800 ${message.senderType === 'User' ? 'place-self-end' : 'place-self-start'}`}
                                                        >{format(message.createdAt!, "h:mm a")}</p>
                                                    </>
                                                )) : (
                                                    <div className="w-full">
                                                        <p className="text-center font-bold">
                                                            New Chat
                                                        </p>
                                                    </div>
                                                )}
                                                <div ref={messagesEndRef} />
                                            </div>
                                            <div className="p-3 bg-blue-100 border-t border-blue-300 flex items-center space-x-2">
                                                <input
                                                    type="text"
                                                    className="flex-1 border rounded-lg px-3 py-1 focus:outline-none bg-white text-blue-800 placeholder-blue-600"
                                                    placeholder="Type a message..."
                                                    value={newMessageTxt}
                                                    onChange={(e) => setNewMessageTxt(e.target.value)}
                                                />
                                                <button
                                                    className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-400 font-medium"
                                                    onClick={sendMessageHandler}
                                                    type="button"
                                                >
                                                    Send
                                                </button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            )
                        }
                    </div>

                </div>
            </div>
        </>
    )
}
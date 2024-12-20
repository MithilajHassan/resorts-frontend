import { Input } from "../../ui/input"
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form"
import { isApiError } from "../../../utils/errorHandling"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast, ToastContainer } from "react-toastify"
import { z } from "zod"
import { Button } from "../../ui/button"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { RootState } from "@/store"
import { useCreateBookingMutation, useSetPaymentStatusMutation } from "../../../slices/userApiSlice"
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Label } from "../../ui/label";

const formSchema = z.object({
    guestName: z.string().min(3, { message: "Guest name is required" })
        .max(18, { message: "Guest name cannot exceed 18 characters" })
        .regex(/^[A-Z\sa-z]+$/, { message: "Guest name should contain only letters" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().regex(/^[0-9]{10,}$/, { message: "Phone number must be 10 digits" }),
    paymentMethod: z.enum(['upi', 'wallet'])
})

export default function GuestForm() {
    // const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const { Razorpay } = useRazorpay()
    const [createBooking] = useCreateBookingMutation()
    const [setPaymentStatus] = useSetPaymentStatusMutation()
    const { checkoutDetails } = useSelector((state: RootState) => state.checkout)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            guestName: '',
            email: '',
            phone: '',
            paymentMethod: 'upi'
        }
    })

    useEffect(() => {
        if (checkoutDetails) {
            form.reset({
                guestName: checkoutDetails?.guestName,
                email: checkoutDetails?.guestEmail,
                phone: checkoutDetails.guestPhone ? String(checkoutDetails?.guestPhone) : '',
            })
        }
    }, [checkoutDetails])



    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const res = await createBooking({
                userId: checkoutDetails?.userId!,
                resortId: checkoutDetails?.resortId!,
                roomId: checkoutDetails?.roomId!,
                guestName: values.guestName,
                guestEmail: values.email,
                guestPhone: Number(values.phone),
                guestCount: checkoutDetails?.guestCount!,
                checkInDate: checkoutDetails?.checkInDate!,
                checkOutDate: checkoutDetails?.checkOutDate!,
                checkInTime: checkoutDetails?.checkInTime!,
                checkOutTime: checkoutDetails?.checkOutTime!,
                totalPrice: checkoutDetails?.totalPrice!,
                paymentMethod: values.paymentMethod,
                discount: checkoutDetails?.discount
            }).unwrap()
            if (values.paymentMethod == 'upi') {
                const options: RazorpayOrderOptions = {
                    key: process.env.REACT_APP_RAZORPAY_KEY_ID!,
                    amount: Number(res.amount),
                    currency: 'INR',
                    name: 'Resort',
                    description: 'Booking Payment',
                    image: '/images/Logo.png',
                    order_id: res?.orderId!,
                    async handler() {
                        await setPaymentStatus({ bookingId: res.bookingId, status: true }).unwrap()
                        navigate('/booking-success')
                    }
                }
                const razorpayInstance = new Razorpay(options);
                razorpayInstance.open()
            }else{
                await setPaymentStatus({ bookingId: res.bookingId, status: true }).unwrap()
                navigate('/booking-success')
            }
        } catch (err) {
            if (isApiError(err)) {
                toast(<div className="text-red-600">{err.data.message}</div>)
            } else {
                toast('Internal server error')
            }
        }
    }

    return (
        <div className="w-full  lg:w-4/5 space-y-2 shadow-md pb-4">
            <ToastContainer />

            <div className="border-b pb-2 ps-4">
                <h2 className="text-xl font-semibold">Guest details</h2>
            </div>
            <Form {...form} >
                <form className="p-4 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>

                    <div className="grid grid-cols-2 space-x-2">

                        <FormField
                            control={form.control}
                            name="guestName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Guest Name</FormLabel>
                                    <FormControl>
                                        <Input className="bg-indigo-50" placeholder="Enter guest name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Guest Email</FormLabel>
                                    <FormControl>
                                        <Input className="bg-indigo-50" placeholder="Enter guest name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Guest Phone</FormLabel>
                                <FormControl>
                                    <Input className="bg-indigo-50" placeholder="Enter guest phone" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Payment Methode</FormLabel>
                                <FormControl>
                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="upi" id="r1" />
                                            <Label htmlFor="r1">UPI</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="wallet" id="r2" />
                                            <Label htmlFor="r2">Wallet</Label>
                                        </div>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <div className="flex justify-end w-full">
                        <Button className="w-52 bg-blue-700 hover:bg-blue-400 text-md" size={'lg'}>Proceed to pay</Button>
                    </div>

                </form>
            </Form>

        </div>
    )
}

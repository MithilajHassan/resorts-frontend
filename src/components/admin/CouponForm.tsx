import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useCreateCouponMutation } from "../../slices/adminApiSlice"
import { useDispatch } from "react-redux"
import { addCoupon } from "../../slices/couponSlice"
import { toast } from "react-toastify"
import { isApiError } from "../../utils/errorHandling"


interface Props {
    setGetForm: React.Dispatch<React.SetStateAction<boolean>>
}

const formSchema = z.object({
    code: z.string().min(10, "Code at least 10 characters"),
    discount: z.string().regex(/^[1-9][0-9]*$/, 'Discount price required'),
    minBooking: z.string().regex(/^[1-9][0-9]{2,}$/, 'Minimum booking price must be a number greater than 99'),
    expiry: z.string().refine(date => new Date(date) > new Date(), {
        message: "Expiry Date should be in the future"
    })
})

export default function CouponForm({ setGetForm }: Props) {

    const [createCoupon] = useCreateCouponMutation()
    const dispatch = useDispatch()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: '',
            discount: '',
            minBooking: '',
            expiry: '',
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const res = await createCoupon({
                code: values.code,
                discount: Number(values.discount),
                minBooking: Number(values.minBooking),
                expireAt: new Date(values.expiry)
            }).unwrap()
            if (res.success) {
                dispatch(addCoupon({
                    code: values.code,
                    discount: Number(values.discount),
                    minBooking: Number(values.minBooking),
                    expireAt: new Date(values.expiry)
                }))
                setGetForm(false)
            }

        } catch (err) {
            if (isApiError(err)) {
                toast(err.data.message)
            } else {
                toast('Internal server error')
            }
        }
    }

    return (
        <div className="flex flex-col items-center mt-16 w-full">
            <Form {...form}>
                <div className="shadow w-7/12 my-5 rounded-md">
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 m-6 mx-12">
                        <h3 className="font-bold text-center text-xl">Add Coupon</h3>
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Coupon Code</FormLabel>
                                    <FormControl>
                                        <Input className="bg-indigo-50" placeholder="Enter coupon code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="discount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount Price</FormLabel>
                                    <FormControl>
                                        <Input className="bg-indigo-50" placeholder="Enter the discount price" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="minBooking"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Minimun Booking Price</FormLabel>
                                    <FormControl>
                                        <Input className="bg-indigo-50" placeholder="Enter the minimun price" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="expiry"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Expiry Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" className="bg-indigo-50" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-center">
                            <Button className="bg-blue-700 hover:bg-blue-400" type="submit">Submit</Button>
                        </div>

                    </form>
                </div>
            </Form>

        </div>
    )
}
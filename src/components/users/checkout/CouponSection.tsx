import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { Label } from "../../../components/ui/label"
import { useEffect, useState } from "react"
import { useApplyCouponMutation, useListCouponsMutation } from "../../../slices/userApiSlice"
import { setCoupon } from "../../../slices/couponSlice"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog"
import { toast } from "react-toastify"
import { IBooking } from "@/types/types"
import { setCheckout } from "../../../slices/checkoutSlice"
import { isApiError } from "../../../utils/errorHandling"


type Props = {
    checkoutDetails: IBooking
}

export default function CouponSection({ checkoutDetails }: Props) {
    const [code, setCode] = useState<string>('')
    const [isApplied, setApplied] = useState<boolean>(false)
    const [listCoupons] = useListCouponsMutation()
    const [applyCoupon] = useApplyCouponMutation()
    const { coupons } = useSelector((state: RootState) => state.coupons)
    const dispatch = useDispatch()

    useEffect(() => {
        (async () => {
            try {
                const res = await listCoupons({ price: checkoutDetails.totalPrice }).unwrap()
                if (res.success) {
                    dispatch(setCoupon(res.data))
                }
            } catch (err) {
                toast('Internal server error')
            }
        })()
    }, [])

    const handleApply = async () => {
        try {
            if (code.trim() == '') {
                toast('Enter coupon code')
                return
            }
            const coupon = coupons.find(item => code == item.code)
            if (coupon?.minBooking! <= checkoutDetails.totalPrice) {
                const res = await applyCoupon({
                    userId: checkoutDetails.userId,
                    couponId: coupon?._id!
                }).unwrap()
                if (res.success) {
                    dispatch(setCheckout({
                        userId: checkoutDetails.userId,
                        resortId: checkoutDetails.resortId,
                        roomId: checkoutDetails.roomId,
                        guestName: checkoutDetails.guestName,
                        guestEmail: checkoutDetails.guestEmail,
                        guestPhone: checkoutDetails.guestPhone,
                        guestCount: checkoutDetails.guestCount,
                        checkInTime: checkoutDetails.checkInTime,
                        checkOutTime: checkoutDetails.checkOutTime,
                        checkInDate: checkoutDetails.checkInDate,
                        checkOutDate: checkoutDetails.checkOutDate,
                        paymentMethod: checkoutDetails.paymentMethod,
                        totalPrice: checkoutDetails.totalPrice - coupon?.discount!,
                        discount: coupon?.discount,
                    }))
                    setCode('')
                    setApplied(true)
                } else {
                    toast('Coupon apply failed')
                }
            } else {
                toast('Coupon not valid')
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
        <div>
            {
                isApplied ? (
                    <div>
                        <p className="text-center font-bold text-green-700">Coupon applied</p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-center mb-2">
                            <Dialog>
                                <DialogTrigger>
                                    <Button className="bg-blue-600" size={'sm'} >Show Available coupons</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Coupons
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className="">
                                        <div className="flex justify-around border-2 my-2">
                                            <p className="font-bold">Code</p>
                                            <p className="font-bold">Discount</p>
                                        </div>
                                        {coupons.map((item) => (
                                            <div className="flex justify-around border-2 my-2">
                                                <p className="text-center">{item.code}</p>
                                                <p className="text-center">{item.discount}₹</p>
                                            </div>
                                        ))}
                                    </div>

                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="mx-2 mt-4 flex flex-col items-center">
                            <div className="w-full">
                                <Label className="">Coupon Code</Label>
                                <Input className="bg-blue-50" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter coupon code" />
                            </div>
                            <Button onClick={() => handleApply()} className="bg-green-600 mt-2" size={'sm'}>Apply</Button>
                        </div>
                    </>
                )
            }
        </div>

    )
}
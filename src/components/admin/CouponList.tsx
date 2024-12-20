import { RootState } from "@/store"
import { useDeleteCouponMutation, useListCouponsMutation } from "../../slices/adminApiSlice"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { deleteOneCoupon, setCoupon } from "../../slices/couponSlice"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import CouponForm from "./CouponForm"
import { Button } from "../ui/button"
import { MdEdit } from "react-icons/md"
import DeletConfirm from "../common/DeleteConfirm"
import { toast, ToastContainer } from "react-toastify"
import { format } from "date-fns"

export default function CouponList() {
    const [listCoupons] = useListCouponsMutation()
    const { coupons } = useSelector((state: RootState) => state.coupons)
    const [getForm, setGetForm] = useState<boolean>(false)
    const dispatch = useDispatch()
    const [deleteCoupon] = useDeleteCouponMutation()
    useEffect(() => {
        (async () => {
            try {
                const res = await listCoupons().unwrap()
                if (res.success) {
                    dispatch(setCoupon(res.data))
                }
            } catch (err) {
            }
        })()
    }, [])

    const handleDelete = async (id:string)=>{
        const res = await deleteCoupon(id).unwrap()
        if(res.success){
            dispatch(deleteOneCoupon(id))
            toast(res.message)
        }
    }

    return (
        <>
        <ToastContainer />
            {getForm ? (<CouponForm setGetForm={setGetForm} />) : (
                <div className="flex flex-col items-center mt-16 w-full">
                    <div className="flex justify-end my-4 w-7/12">
                        <Button
                            onClick={() => setGetForm(true)}
                            className="bg-blue-600 hover:bg-blue-400 text-white"
                        >
                            Add Coupon
                        </Button>
                    </div>
                    <div className="w-7/12 border-2 rounded-md">
                        <Table className="w-full">
                            <TableHeader className="bg-blue-100 text-black h-12">
                                <TableRow>
                                    <TableHead className="text-black font-bold">Coupon Code</TableHead>
                                    <TableHead className="text-black font-bold">Discount Price</TableHead>
                                    <TableHead className="text-black font-bold">Min Booking Price</TableHead>
                                    <TableHead className="text-black font-bold">Expiry</TableHead>
                                    <TableHead className="text-black font-bold text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {coupons.length ? (
                                    coupons?.map((item) => (
                                        <TableRow className="h-10" key={item._id}>
                                            <TableCell className="font-medium">{item.code}</TableCell>
                                            <TableCell className="font-medium">{item.discount}</TableCell>
                                            <TableCell className="font-medium">{item.minBooking}</TableCell>
                                            <TableCell className="font-medium">{format(item.expireAt,"MM-dd-yyy")}</TableCell>
                                            <TableCell className="text-right flex justify-end items-center gap-5">
                                                <MdEdit style={{ fontSize: '1.3rem' }} className="text-blue-700 hover:text-blue-400" />
                                                <DeletConfirm id={item._id!} onConfirm={handleDelete} />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center font-semibold">coupons not found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}
        </>
    )
}
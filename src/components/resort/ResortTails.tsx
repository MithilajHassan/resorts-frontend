import { useEffect, useState } from "react";
import { useGetTailsDetailsMutation } from "../../slices/resortAdminApiSlice";
import { FaBook } from "react-icons/fa"
import { GiBlockHouse } from "react-icons/gi"
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { MdOutlineBedroomParent } from "react-icons/md";




export default function ResortTails() {
    const {resortAdmin} = useSelector((state:RootState)=>state.auth)
    const [getTailsDetails] = useGetTailsDetailsMutation()
    const [rooms,setRooms] = useState<number>(0)
    const [bookings,setBookings] = useState<number>(0)
    const [stays,setStays] = useState<number>(0)
    const [revenue,setRevenue] = useState<number>(0)

    useEffect(()=>{
        
        getTailsDetails({resortId:resortAdmin?._id!}).then((v)=>{
            if(v.data){
                setRooms(v.data.rooms)
                setStays(v.data.stays)
                setBookings(v.data.bookings)
                setRevenue(v.data.revenue)
            }
        })
    },[getTailsDetails])

    return (
        <div className="flex justify-center w-full">

            <div className="flex w-4/6">
                <div className="mx-auto rounded-md px-8 py-3 shadow-md text-center">
                    <FaBook className="mx-auto size-6 text-blue-600"/>
                    <h3 className="font-bold text-blue-800">Bookings</h3>
                    <p className="font-semibold">{bookings}</p>
                </div>
                <div className="mx-auto rounded-md px-6 py-3 shadow-md text-center">
                    <MdOutlineBedroomParent className="mx-auto size-6 text-green-600"/>
                    <h3 className="font-bold text-blue-800">Total Rooms</h3>
                    <p className="font-semibold">{rooms}</p>
                </div>
                <div className="mx-auto rounded-md px-6 py-3 shadow-md text-center">
                    <GiBlockHouse className="mx-auto size-6 text-fuchsia-700"/>
                    <h3 className="font-bold text-blue-800">Total stays</h3>
                    <p className="font-semibold">{stays}</p>
                </div>
                <div className="mx-auto rounded-md px-8 py-3 shadow-md text-center">
                    <RiMoneyRupeeCircleFill className="mx-auto text-yellow-400 size-6"/>
                    <h3 className="font-bold text-blue-800">Revenue</h3>
                    <p className="font-semibold text-green-700">{revenue}₹</p>
                </div>
            </div>

        </div>
    )
}
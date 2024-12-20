import { useEffect, useState } from "react";
import { useGetTailsDetailsMutation } from "../../slices/adminApiSlice";
import { FaBook, FaUsers } from "react-icons/fa"
import { GiBlockHouse } from "react-icons/gi"
import { RiMoneyRupeeCircleFill } from "react-icons/ri";


type Props = {}

export default function AdminTails({ }: Props) {

    const [getTailsDetails] = useGetTailsDetailsMutation()
    const [users,setUsers] = useState<number>(0)
    const [bookings,setBookings] = useState<number>(0)
    const [resorts,setResorts] = useState<number>(0)
    const [revenue,setRevenue] = useState<number>(0)
    const [resortRevenue,setResortRevenue] = useState<number>(0)

    useEffect(()=>{
        getTailsDetails().then((v)=>{
            if(v.data){
                setUsers(v.data.users)
                setResorts(v.data.resorts)
                setBookings(v.data.bookings)
                setRevenue(v.data.revenue)
                setResortRevenue(v.data.resortRevenue)
            }
        })
    },[getTailsDetails])

    return (
        <div className="flex justify-center w-full">

            <div className="flex w-4/6">
                <div className="mx-auto rounded-md px-8 py-3 shadow-md text-center">
                    <RiMoneyRupeeCircleFill className="mx-auto text-yellow-400 size-6"/>
                    <h3 className="font-bold text-blue-800">Revenue</h3>
                    <p className="font-semibold text-green-700">{revenue}₹</p>
                </div>
                <div className="mx-auto rounded-md px-6 py-3 shadow-md text-center">
                    <FaUsers className="mx-auto size-6 text-green-600"/>
                    <h3 className="font-bold text-blue-800">Total Users</h3>
                    <p className="font-semibold">{users}</p>
                </div>
                <div className="mx-auto rounded-md px-6 py-3 shadow-md text-center">
                    <GiBlockHouse className="mx-auto size-6 text-fuchsia-700"/>
                    <h3 className="font-bold text-blue-800">Total Resorts</h3>
                    <p className="font-semibold">{resorts}</p>
                </div>
                <div className="mx-auto rounded-md px-8 py-3 shadow-md text-center">
                    <FaBook className="mx-auto size-6 text-blue-600"/>
                    <h3 className="font-bold text-blue-800">Bookings</h3>
                    <p className="font-semibold">{bookings}</p>
                </div>
                <div className="mx-auto rounded-md px-8 py-3 shadow-md text-center">
                    <RiMoneyRupeeCircleFill className="mx-auto text-yellow-400 size-6"/>
                    <h3 className="font-bold text-blue-800">Resorts Revenue</h3>
                    <p className="font-semibold text-green-700">{resortRevenue}₹</p>
                </div>
            </div>

        </div>
    )
}
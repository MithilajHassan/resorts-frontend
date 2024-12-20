import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "../ui/card";
import { FaMapMarkerAlt } from "react-icons/fa";
import { RootState, AppDispatch } from "../../store";
import { useAcceptResortMutation, useRejectResortMutation } from "../../slices/adminApiSlice";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { isApiError } from '../../utils/errorHandling';
import { toast, ToastContainer } from "react-toastify";
import { IResort } from "@/types/types";
import { Button } from "../ui/button";
import { editResort } from "../../slices/resortsSlice";

export default function ResortDetails() {
    const { id } = useParams()
    // const { data } = useGetResortDetailsQuery(id!)
    const { resorts } = useSelector((state: RootState) => state.resorts)
    const [acceptResort] = useAcceptResortMutation()
    const [rejectResort] = useRejectResortMutation()
    const [resort, setResort] = useState<IResort>()
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        setResort(resorts.find((resort) => resort._id == id))
    }, [resorts, id])


    const acceptResortHandler = async (id: string) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to accept this resort?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, accept it!',
                cancelButtonText: 'Cancel',
            });

            if (result.isConfirmed) {
                const res = await acceptResort(id).unwrap()
                if (res.success) {
                    dispatch(editResort(res.resort))
                    toast(<div className='text-green-600'>The resort has been accepted.</div>)
                }
            }
        } catch (err) {
            if (isApiError(err)) {
                toast(<div className="text-red-600">{err.data.message || "Internal Server Error"}</div>)
            } else {
                toast('An unexpected error occurred')
            }
        }
    }

    const rejectResortHandler = async (id: string) => {
        try {
            const result = await Swal.fire({
                title: 'Reject Resort',
                input: 'textarea',
                inputLabel: 'Reason for rejection',
                inputPlaceholder: 'Type your reason here...',
                inputValidator: (value) => {
                    if (!value) {
                        return 'You need to provide a reason!';
                    }
                },
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, reject it!',
                cancelButtonText: 'Cancel',
            });

            if (result.isConfirmed && result.value) {
                const reason: string = result.value
                const res = await rejectResort({ resortId: id, reason }).unwrap()
                if (res.success) {
                    dispatch(editResort(res.resort))
                    toast(<div className='text-green-600'>The resort has been rejected.</div>)
                }
            }
        } catch (err) {
            if (isApiError(err)) {
                toast(<div className="text-red-600">{err.data.message || "Internal Server Error"}</div>)
            } else {
                toast('An unexpected error occurred')
            }
        }
    }

    return (
        <section className="flex justify-center bg-white p-6 mt-12 ml-24 w-full">
            <ToastContainer />
            <div className="w-fit flex gap-4">
                {resort ? (
                    <>
                        <div>
                            <div className="flex flex-col lg:flex-row gap-4 mb-4  w-fit">
                                <div className="flex-1">
                                    <h1 className="text-xl font-bold mb-4">{resort.resortName}</h1>
                                    <p className="flex items-center text-gray-600 text-md">
                                        <FaMapMarkerAlt className="mr-2 text-red-500" />
                                        {resort.address}, India
                                    </p>
                                </div>
                            </div>

                            <div className="flex-1 grid grid-cols-2 gap-2 w-96">
                                {resort.images && (
                                    <>
                                        {resort.images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`Resort Image ${index + 2}`}
                                                className="w-full h-32 rounded-xl object-cover"
                                            />
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>

                        <div>
                            <p className="text-black text-md w-full">{resort?.description}</p>
                            <div className="mt-4 flex justify-center items-center flex-col w-full">

                                <Card className="mb-2 w-3/5">
                                    <CardContent className="p-4">
                                        <h3 className="text-xl font-semibold mb-2 text-center">Categories</h3>
                                        <ul className="text-blue-700 flex flex-wrap gap-3 font-semibold">
                                            {resort?.categories?.map((category, index) => (
                                                <li key={index}>
                                                    {typeof category === "string"
                                                        ? category
                                                        : category?.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>

                                <Card className="w-3/5">
                                    <CardContent className="p-4">
                                        <h3 className="text-xl font-semibold mb-2 text-center">Facilities</h3>
                                        <ul className="text-blue-700 flex flex-wrap gap-3 font-semibold">
                                            {resort?.facilities?.map((facility, index) => (
                                                <li key={index}>
                                                    {typeof facility === "string"
                                                        ? facility
                                                        : facility?.facilityName}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>

                                <div className="p-4">
                                    <p className="text-center font-bold mb-2">
                                        Status :
                                        <span
                                            className={`ml-1 ${resort.isVerify ? 'text-green-600 font-bold' : 'text-red-600 font-bold'
                                                }`}
                                        >
                                            {resort.isVerify ? 'Verified' : resort.isRejected ? 'Rejected' : 'Unverified'}
                                        </span>
                                    </p>

                                    {!resort.isVerify && !resort.isRejected && (
                                        <>

                                            <Button
                                                onClick={() => acceptResortHandler(resort._id!)}
                                                className="text-white hover:bg-green-400 bg-green-600  mr-1"
                                                size={'lg'}
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                onClick={() => rejectResortHandler(resort._id!)}
                                                className="text-white bg-red-600 hover:bg-red-400 "
                                                size={'lg'}
                                            >
                                                Reject
                                            </Button>
                                        </>)}
                                </div>

                            </div>
                        </div>
                    </>
                ) : (
                    <p>Loading resort data...</p>
                )}
            </div>
        </section>
    )
}
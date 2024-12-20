import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "../ui/card";
import { FaMapMarkerAlt } from "react-icons/fa";
import { RootState } from "../../store";
import { useGetMyResortQuery } from "../../slices/resortAdminApiSlice";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { setMyResort } from "../../slices/myResortSlice";

export default function MyResort() {
    const { resortAdmin } = useSelector((state: RootState) => state.auth)
    const { data } = useGetMyResortQuery(resortAdmin?._id!)
    const { resort } = useSelector((state: RootState) => state.myResort)
    const dispatch = useDispatch()
    useEffect(() => {
        if(data && resort == null){
            dispatch(setMyResort(data))
        }
    }, [data])


    return (
        <section className="flex justify-center bg-white p-6 mt-12 ml-24 w-full">
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
                                <Link to={`/resort/myresort/update`}><Button className="bg-blue-600 mt-5 w-28 hover:bg-blue-400">EDIT</Button></Link>
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
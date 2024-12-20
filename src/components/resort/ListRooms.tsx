import { MdEdit } from "react-icons/md"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Link } from "react-router-dom"
import { useDeleteRoomMutation, useListRoomsQuery } from "../../slices/resortAdminApiSlice"
import { useSelector } from "react-redux"
import { RootState } from "../../store"
import { Button } from "../ui/button"
import { toast, ToastContainer } from "react-toastify"
import DeletConfirm from "../common/DeleteConfirm"

const ListRooms = () => {
    const { resortAdmin } = useSelector((state: RootState) => state.auth)
    const { data: rooms = [] } = useListRoomsQuery(resortAdmin?._id!)
    const [deleteRoom] = useDeleteRoomMutation()

    const handleDelete = async (roomId: string) => {
        const res = await deleteRoom(roomId).unwrap()
        if (res?.success) {
            toast(<div className="text-green-700">The room has been deleted.</div>)
        }
    }

    return (
        <div className="mt-20 mx-auto">
            <ToastContainer />
            <div className="flex justify-end mb-2">
                <Link to={'/resort/rooms/add'}>
                    <Button className="bg-blue-600 hover:bg-blue-400 text-white">Add Room</Button>
                </Link>
            </div>
            <div className="border-2 rounded-md ">
                <Table className="">
                    <TableHeader className="bg-blue-100 text-black h-12">
                        <TableRow>
                            <TableHead className="text-black font-bold">Room Name</TableHead>
                            <TableHead className="text-black font-bold">Guests</TableHead>
                            <TableHead className="text-black font-bold">Available Rooms</TableHead>
                            <TableHead className="text-black font-bold">Normal Price</TableHead>
                            <TableHead className="text-black font-bold">Offer Price</TableHead>
                            <TableHead className="text-black font-bold text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rooms.length > 0 ? (
                            rooms.map((room) => (
                                <TableRow className="h-10" key={room._id}>
                                    <TableCell className="font-medium">{room.name}</TableCell>
                                    <TableCell className="text-center">{room.numberOfGuests}</TableCell>
                                    <TableCell className="text-center">{room.totalRooms}</TableCell>
                                    <TableCell>{`₹${room.normalPrice}`}</TableCell>
                                    <TableCell>{`₹${room.offerPrice}`}</TableCell>
                                    <TableCell className="text-right flex justify-end items-center gap-5">
                                        <Link to={`/resort/rooms/update/${room._id}`}>
                                            <MdEdit
                                                style={{ fontSize: '1.3rem' }}
                                                className="text-blue-700 hover:text-blue-400 cursor-pointer"
                                            />
                                        </Link>
                                        <DeletConfirm id={room?._id!} onConfirm={handleDelete} />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">Rooms not found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default ListRooms
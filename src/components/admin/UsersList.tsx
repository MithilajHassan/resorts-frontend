import { useListUsersQuery, useManageBlockUnblockUserMutation } from "../../slices/adminApiSlice"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { toast } from 'react-toastify';
import BlockConfirm from "../common/BlockConfirm";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setBlockStatus, setUsers } from "../../slices/userSlice";
import { isApiError } from "../../utils/errorHandling";
import { clearAdminAuth } from "../../slices/authSlice";
import { useNavigate } from "react-router-dom";

function UsersList() {
    const { data, error: err, } = useListUsersQuery(undefined)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { users } = useSelector((state: RootState) => state.users)
    const [manageUserBlock] = useManageBlockUnblockUserMutation()

    useEffect(() => {
        if (data) {
            dispatch(setUsers(data))
        } else if (err) {
            if (isApiError(err)) {
                if (err.status == 401) {
                    dispatch(clearAdminAuth())
                    navigate('/admin/signin')
                }else {
                    toast('Internal server error')
                }
            } else {
                toast('Internal server error')
            }
        }
    }, [data,err])

    const handleBlockUnblock = async (userId: string, status: boolean) => {
        const action = status ? 'Unblock' : 'Block'
        try {
            const response = await manageUserBlock({ id: userId, status: !status }).unwrap()
            if (response.success) {
                dispatch(setBlockStatus({ id: userId, status: !status }))
                toast(`The user has been ${action.toLowerCase()}ed successfully.`)
            }
        } catch (err) {
            console.error(`Error :`, err)
            toast(`There was a problem ${action.toLowerCase()}ing the user.`)
        }
    }

    return (
        <div className="w-7/12 border-2 mt-20 rounded-md mx-auto my-5 h-fit">
            <Table className="w-full">
                <TableHeader className="bg-blue-100 text-black h-12">
                    <TableRow>
                        <TableHead className="text-black font-bold">Name</TableHead>
                        <TableHead className="text-black font-bold">Email</TableHead>
                        {/* <TableHead className="text-black font-bold">Phone</TableHead> */}
                        <TableHead className="text-black font-bold text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users?.map((user) => (
                        <TableRow className="h-10" key={user._id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            {/* <TableCell>{user.phone}</TableCell> */}
                            <TableCell className="text-right">
                                <BlockConfirm id={user._id} onConfirm={handleBlockUnblock} isBlocked={user.isBlock} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default UsersList
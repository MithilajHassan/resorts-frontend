import { FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import Loader from "../common/Loader"
import { isApiError } from "../../utils/errorHandling"
import { useUpdatePasswordMutation } from "../../slices/userApiSlice"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { toast, ToastContainer } from "react-toastify"
import { Input } from "../ui/input"


type Props = {}

export default function ChangePasswordForm({ }: Props) {

    const { userInfo } = useSelector((state: RootState) => state.auth);
    const [currPassword, setCurrPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPasswords, setShowPasswords] = useState<boolean>(false)
    const [errMsg, setErrMsg] = useState('')
    const [updatePassword, { isLoading }] = useUpdatePasswordMutation()
    const navigate = useNavigate()

    const submitHandler = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])[^\s]{4,18}$/
            if (currPassword.trim().length <= 0) {
                return setErrMsg('Enter the current password')
            }
            if (!reg.test(newPassword)) {
                return setErrMsg('Password must be at least 4 characters, contain at least one lowercase letter, one uppercase letter, one special character and one digit without space')
            }
            if (newPassword !== confirmPassword) {
                return setErrMsg('Password are not match')
            }
            const res = await updatePassword({
                id: userInfo?._id!,
                currPassword,
                newPassword
            }).unwrap()
            if (res.success) {
                setErrMsg('')
                toast('Password changed successfully')
                setTimeout(() => {
                    navigate('/myprofile')
                }, 2000)
            }
        } catch (err) {
            if (isApiError(err)) {
                setErrMsg(err.data?.message)
            } else {
            }
        }
    }

    return (
        <section className="w-full max-w-md mx-auto mt-30 p-6 bg-white shadow-md rounded-lg">
            <ToastContainer />
            <form className="flex flex-col space-y-3 w-94 md:w-96 sm:w-96 lg:w-96" onSubmit={(e) => submitHandler(e)}>
                <h2 className="text-2xl font-bold text-center mb-4">Change Password</h2>
                <p id="errMsg" className="text-red-500 text-center mx-1 break-words">{errMsg}</p>

                <div className="flex flex-col">
                    <label htmlFor="currPassword" className="text-gray-700">Current Password</label>
                    <Input
                        type={showPasswords ? "text" : "password"}
                        value={currPassword}
                        onChange={(e) => setCurrPassword(e.target.value)}
                        placeholder="Enter your current password"
                        className="bg-indigo-50"
                        required={true}
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="newPassword" className="text-gray-700">New Password</label>
                    <Input
                        type={showPasswords ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter your new password"
                        className="bg-indigo-50"
                        required={true}
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</label>
                    <Input
                        type={showPasswords ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Enter your new password again"
                        className="bg-indigo-50"
                        required={true}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        onChange={() => setShowPasswords((v) => !v)}
                        className="bg-indigo-50 size-4"
                    />
                    <label htmlFor="confirmPassword" className="text-gray-700">Show Passwords</label>
                </div>

                <button type="submit" className="p-1.5 bg-blue-700 rounded-md text-white">Update</button>

                <p className="text-center">Forget Password?</p>
            </form>
            {isLoading && (
                <>
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50"></div>
                    <div className="absolute top-52 p-8 bg-white">
                        <Loader />
                    </div>
                </>
            )}
        </section>
    )
}
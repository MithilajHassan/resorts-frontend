import { AppDispatch } from "../../store"
import { useSigninMutation } from "../../slices/authApiSlice"
import { setAdminAuth, setCredentials } from "../../slices/authSlice"
import { FormEvent, useEffect, useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { RootState } from "../../store"
import Loader from "./Loader"

interface SigninFormProps {
    role: 'user' | 'admin';
    signupUrl?: string;
    nextPage: string;
}

const SigninForm: React.FC<SigninFormProps> = ({ role, signupUrl, nextPage }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errMsg, setErrMsg] = useState('')

    const { adminInfo } = useSelector((state: RootState) => state.auth)
    const { userInfo } = useSelector((state: RootState) => state.auth)
    const [signin, { isLoading }] = useSigninMutation()
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    useEffect(() => {
        if (role == 'admin') {
            if (adminInfo) {
                navigate('/admin/dashboard')
            }
        } else {
            if (userInfo) {
                navigate('/')
            }
        }
    }, [])

    const submitHandler = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const res = await signin({ email, password, role }).unwrap()
            if (role == 'user') {
                dispatch(setCredentials(res))
            } else {
                dispatch(setAdminAuth(res))
            }
            navigate(nextPage)
        } catch (err: any) {
            if (err?.data) {
                setErrMsg(err.data?.message)
            }
        }
    }

    const loginWithGoogle = async () => {
        window.location.href = `${process.env.REACT_APP_GOOGLE_AUTH_URL}`
    }

    return (
        <section className="bg-white min-h-screen flex items-center justify-center">
            <form className="flex flex-col space-y-2.5 w-94 md:w-96 sm:w-96 lg:w-96" onSubmit={(e) => submitHandler(e)}>
                <h3 className="font-bold text-xl">Sign-In</h3>
                <p id="errMsg" className="text-red-500 text-center mx-1 break-words">{errMsg}</p>

                <div className="flex flex-col">
                    <label htmlFor="email" className="text-gray-700">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="p-1.5 border border-gray-400 rounded"
                        required={true}
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="password" className="text-gray-700">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="p-1.5 border border-gray-400 rounded"
                        required
                    />
                </div>

                <button type="submit" className="p-1.5 bg-blue-700 rounded-md text-white">Signin</button>
                {role == 'user' && (<><p className="text-center">Or</p>
                    <div className="flex justify-center" onClick={() => loginWithGoogle()}>
                        <div className="border-solid border border-gray-400 h-10 w-12 flex justify-center items-center">
                            <FcGoogle style={{ fontSize: '1.5rem' }} />
                        </div>
                    </div></>)}
                {signupUrl && (<p className="text-center">New user?<Link to={signupUrl} className="text-blue-700 underline"> signup</Link></p>)}
            </form>
            {isLoading && (
                <>
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50"></div>
                    <div className="absolute modal p-8 bg-white">
                        <Loader />
                    </div>
                </>
            )}
        </section>
    )
}

export default SigninForm
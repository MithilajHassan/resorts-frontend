import { isApiError } from "../../utils/errorHandling"
import { useSignupMutation, useVerifyOtpMutation, useResendOtpMutation } from "../../slices/authApiSlice"
import { FormEvent, useEffect, useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { Link, useNavigate } from "react-router-dom"
import { toast,ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { RootState } from "@/store"
import { useSelector } from "react-redux"


const SignupForm = () => {
    const { userInfo } = useSelector((state:RootState)=>state.auth)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [isSentOtp, setIsSentOtp] = useState(false)
    const [enteredOtp, setOtp] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [count, setCount] = useState(0)
    const [resendBtnVisible, setResendBtnVisible] = useState(false)

    const navigate = useNavigate()
    const [signup] = useSignupMutation()
    const [verifyOtp] = useVerifyOtpMutation()
    const [resendOtp] = useResendOtpMutation()

    useEffect(()=>{
        if(userInfo){
            navigate('/')
        }
    },[])

    useEffect(() => {
        if (isSentOtp) {
            let timer: ReturnType<typeof setInterval>
            if (count > 0) {
                timer = setInterval(() => {
                    setCount((prev) => prev - 1);
                }, 1000);
            } else if (count === 0) {
                setResendBtnVisible(true)
            }

            return () => clearInterval(timer)
        }
    }, [count, isSentOtp])

    const OtpVerifyHandler = async (e:FormEvent) => {
        e.preventDefault()
        try {
            const response = await verifyOtp({ otp: enteredOtp, name, email, password }).unwrap()
            
            if (response.success) {
                navigate('/signin')
            }
        } catch (err) {   
            if (isApiError(err)) {
                setErrMsg(err.data.message)
            } else {
                toast('Internal server error')
            }
        }
    }

    

    const submitHandler = async (e: FormEvent) => {
        e.preventDefault()
        const nameRegex = /^[a-zA-Z]+[a-z\sA-Z]+$/
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])[^\s]{4,18}$/
        try {
            if (!nameRegex.test(name)) {
                setErrMsg("Only alphabets are allowed in name.")
            }else if (!emailRegex.test(email)) {
                setErrMsg("Invalid email format!")
            }else if (!passwordRegex.test(password)) {
                setErrMsg("Password must be at least 4 characters, contain at least one lowercase letter, one uppercase letter, one special character and one digit without space")
            }else if (password != confirmPassword) {
                setErrMsg("Passwords do not match!")
            } else {
                const res = await signup(email).unwrap()
                if (res.success) {
                    setIsSentOtp(true)
                    setCount(60)
                    setErrMsg('')
                    toast(res.message)
                }
            }
        } catch (err) {
            toast('Internal server error')
        }
    }

    const resendHandler = async () => {
        try {
            const res = await resendOtp(email).unwrap()
            setCount(60)
            setResendBtnVisible(false)
            toast(res.message)
        } catch (err: any) {
            if (err?.data) setErrMsg(err.data.message)
        }
    }

    return (
        <section className="bg-white min-h-screen flex items-center justify-center">
            <ToastContainer/>
            {isSentOtp ? (
                <form className="flex flex-col space-y-2.5 w-94 md:w-96 sm:w-96 lg:w-96" onSubmit={(e) => OtpVerifyHandler(e)}>
                    <h3 className="font-bold text-xl">OTP</h3>
                    <p id="errMsg" className="text-red-500 text-center mx-1 break-words">{errMsg}</p>

                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-gray-700">Please check your mail we sent otp.</label>
                        <input
                            id="enteredOtp"
                            type="number"
                            value={enteredOtp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter the otp"
                            className="p-1.5 border border-gray-400 rounded"
                            required
                        />
                    </div>

                    <button className="p-1.5 bg-blue-700 rounded-md text-white" type="submit" >Verify</button>
                    <div className="flex justify-between">
                        <p className="text-black">00:{count}</p>
                        {resendBtnVisible && (
                            <button className="text-gray-700 hover:text-black" onClick={resendHandler}>Resend</button>
                        )}
                    </div>
                </form>
            ) : (
                <form className="flex flex-col space-y-2.5 w-94 md:w-96 sm:w-96 lg:w-96" onSubmit={(e) => submitHandler(e)}>
                    <h3 className="font-bold text-xl">Sign-Up</h3>
                    <p id="errMsg" className="text-red-500 text-center mx-1 break-words">{errMsg}</p>
                    <div className="flex flex-col">
                        <label htmlFor="name" className="text-gray-700">Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className="p-1.5 border border-gray-400 rounded"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-gray-700">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="p-1.5 border border-gray-400 rounded"
                            required
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

                    <div className="flex flex-col">
                        <label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            className="p-1.5 border border-gray-400 rounded"
                            required
                        />
                    </div>

                    <button type="submit" className="p-1.5 bg-blue-700 rounded-md text-white">Signup</button>

                    <div className="flex justify-center">
                    <div className="border-solid border border-gray-400 h-10 w-12 flex justify-center items-center">
                        <FcGoogle style={{fontSize:'1.5rem'}} />
                    </div>
                </div>

                    <p className="text-center">Already have an account?<Link to={'/signin'} className="text-blue-700 underline"> Signin</Link></p>
                </form>
            )}
        </section>
    )
}

export default SignupForm
import { AppDispatch, RootState } from "../../store"
import { setResortAdmin } from "../../slices/authSlice"
import { FormEvent, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { useResortSigninMutation } from "../../slices/authApiSlice"


const SigninForm = ()=>{
    const { resortAdmin } = useSelector((state:RootState)=>state.auth)
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [errMsg,setErrMsg] = useState('')

    const [ resortSignin ] = useResortSigninMutation()
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    useEffect(()=>{
        if(resortAdmin){
            navigate('/resort/dashboard')
        }
    },[])

    const submitHandler = async(e:FormEvent)=>{
        e.preventDefault()
        try {
            const res = await resortSignin({email,password}).unwrap()
            if(res.success){      
                dispatch(setResortAdmin(res.resortAdmin))
                navigate('/resort/dashboard')
            }
        } catch (err:any) {
            if (err?.data) {
                setErrMsg(err.data?.message) 
            } 
        }
    }

    return (
        <section className="bg-white min-h-screen flex items-center justify-center">
           <form className="flex flex-col space-y-2.5 w-94 md:w-96 sm:w-96 lg:w-96" onSubmit={(e)=>submitHandler(e)}>
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
                
                <p className="text-center">New user?<Link to={'/resort/signup'} className="text-blue-700 underline"> signup</Link></p>
            </form>
        </section>
    )
}

export default SigninForm
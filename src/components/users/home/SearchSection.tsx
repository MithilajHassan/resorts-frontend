import { useGetUserQuery } from "../../../slices/authApiSlice"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setCredentials } from "../../../slices/authSlice"
import { RootState } from "../../../store"
import SearchBar from "../SearchBar"

const SearchSection = () => {
    const { data: user } = useGetUserQuery(undefined)
    const { userInfo } = useSelector((state: RootState) => state.auth)
    const dispatch = useDispatch()
    useEffect(() => {
        if (user?._id && !userInfo) {
            dispatch(setCredentials(user))
        }
    }, [user])

    return (
        <section
            style={{ backgroundImage: "url('/images/Resort-bg.jpg')" }}
            className="min-h-80 mb-2 flex flex-col justify-center mt-16"
        >
            <h1 className="text-3xl font-bold text-white ms-3">Best resorts in India</h1>
            <h2 className="text-xl font-semibold text-white ms-3 ">Find the resorts that appeal to you the most</h2>
           <div className="flex justify-start h-14 ms-3">

            <SearchBar redirect="/search" />
           </div>

        </section>
    )
}

export default SearchSection
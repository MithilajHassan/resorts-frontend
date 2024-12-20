import UserHeader from '../../components/users/UserHeader'
import ResortDetails from '../../components/users/ResortDetails'
import SearchBar from '../../components/users/SearchBar'
import AvailableRooms from '../../components/users/AvailableRooms'
import ListReviews from '../../components/users/ListReviews'
import { useParams } from 'react-router-dom'
import { useResortDetailsQuery } from '../../slices/userApiSlice'
const ResortDetailsPage = () => {
    const { id } = useParams()
    const { data: resort } = useResortDetailsQuery(id!)
    return (
        <>
            <UserHeader />
            <ResortDetails resort={resort!} />
            <hr />
            <p className='my-5 text-blue-600 ms-5'>Select dates to see this property's availability</p>
            <SearchBar />

            <AvailableRooms />

            <ListReviews id={id!} />

        </>
    )
}

export default ResortDetailsPage
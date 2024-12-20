import FilterSidebar from '../../components/users/ResortFilter'
import SearchBar from '../../components/users/SearchBar'
import UserHeader from '../../components/users/UserHeader'
import SearchResults from '../../components/users/SearchResults'

const SearchResultsPage = () => {


    return (
        <>
            <UserHeader />
            <div className='mt-16'>
                <SearchBar />
                <div className="flex justify-center">
                    <FilterSidebar />
                    <SearchResults />
                </div>
            </div>
        </>
    )
}

export default SearchResultsPage
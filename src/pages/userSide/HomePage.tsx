import SearchSection from '../../components/users/home/SearchSection'
import UserHeader from '../../components/users/UserHeader'
import TrendResorts from '../../components/users/home/TrendResorts'
import BannerSection from '../../components/users/home/BannerSection'
const HomePage = ()=>{

    return (
        <>
            <UserHeader/>
            <div className="mt-16">
                <SearchSection />
                <BannerSection />
                <TrendResorts />

            </div>
            
        </>
    )
}

export default HomePage
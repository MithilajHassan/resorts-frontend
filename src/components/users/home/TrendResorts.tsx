import { Link } from "react-router-dom"
import { useListResortsQuery } from "../../../slices/userApiSlice"
import { Card, CardContent, } from "../../ui/card"


const Trend = () => {
    const { data: resort = [] } = useListResortsQuery(undefined)

    return (
        <section className="bg-white py-6">
            <h2 className="text-2xl font-bold text-start mb-3 ml-3">Trending Resorts</h2> {/* Added Title */}
            <div className="flex flex-wrap items-center justify-center gap-2">
                {
                    resort.slice(0, 5).map((item) => (
                        <Card className="w-60" key={item._id}>
                            <Link to={`/resortdetails/${item._id}`}>
                                <img src={item.images[0]} alt="" className="w-full h-52 rounded-t-xl" />
                                <CardContent className="p-1 mt-1">
                                    <p className="font-bold text-wrap">{item.resortName}</p>
                                    <p className="text-gray-500 text-sm mb-1">{item.city}, India</p>
                                    <div className="bg-green-400 px-2 py-1 w-fit rounded mb-14">
                                        <p className="font-semibold text-sm">3.6</p>
                                    </div>
                                </CardContent>
                            </Link>
                        </Card>
                    ))
                }
            </div>
        </section>
    )
}

export default Trend
import { Card } from '../ui/card';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { useDeleteWishlistMutation, useListWishlistQuery } from '../../slices/userApiSlice';
import { useEffect } from 'react';
import { deleteWishlist, setWishlist } from '../../slices/wishlistSlice';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';

const WishlistCard: React.FC = () => {
    const { userInfo } = useSelector((state: RootState) => state.auth);
    const { data } = useListWishlistQuery(userInfo?._id!);
    const { wishlist } = useSelector((state: RootState) => state.wishlist);
    const dispatch = useDispatch<AppDispatch>();
    const [deleteWishlistApi] = useDeleteWishlistMutation()

    useEffect(() => {
        if (data && wishlist.length === 0) {
            dispatch(setWishlist(data.wishlist))
        }
    }, [data]);

    const handleDeleteWishlist = async (id:string) => {
        try {
          const res = await deleteWishlistApi({
            id:id,
          }).unwrap()
          if (res?.success) {
            dispatch(deleteWishlist(id))  
            toast(<div className="text-green-800">{res.message}</div>) 
          }
        } catch (err) { 
            toast(<div className="text-red-700">'Internal server error'</div>)
        }
      }

    return (
        <div className="grow">
            <h1 className="text-2xl font-bold mb-5">Wishlist</h1>
            {wishlist?.length ? (
                wishlist.map((item) => {
                    const resort = typeof item.resortId === 'string' ? null : item.resortId;
                    return (
                        <Link to={`/resortdetails/${resort?._id!}`} key={item._id}>
                            <Card className="flex flex-col md:flex-row items-center p-4 shadow-md mb-2">
                                <img
                                    src={resort?.images[0]!}
                                    alt="Resort"
                                    className="h-24 w-32 rounded-md object-cover mr-4"
                                />
                                <div className="flex flex-col flex-grow space-y-1">
                                    <h2 className="text-lg font-semibold text-gray-800">{resort?.resortName}</h2>
                                    <p className="text-sm text-gray-600">{resort?.address}</p>
                                </div>
                                <div className="flex flex-col items-end ml-4 ">
                                    <button onClick={(e) =>{
                                        e.preventDefault()
                                        handleDeleteWishlist(item._id!)
                                    }}>
                                        <FaHeart className="text-3xl text-red-600 transform transition-transform duration-300 hover:scale-125 cursor-pointer"/>
                                    </button>
                                </div>
                            </Card>
                        </Link>
                    )
                })
            ) : (
                <Card className="p-6 text-blue-800 text-xl font-bold">
                    <p className="text-center">Your wishlist is empty</p>
                </Card>
            )}
        </div>
    );
};

export default WishlistCard;
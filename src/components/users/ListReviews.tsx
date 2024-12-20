import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel"
import { Card, CardContent } from "../ui/card"
import { useListReviewsQuery } from "../../slices/userApiSlice"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setReviews } from "../../slices/reviewSlice"
import { AppDispatch, RootState } from "../../store"


interface Props {
  id: string
}

export default function ListReviews({ id }: Props) {

  const { data } = useListReviewsQuery(id)
  const dispatch = useDispatch<AppDispatch>()
  const { reviews } = useSelector((state:RootState)=>state.reviews)
 
  useEffect(()=>{
    if(data?.reviews){
      dispatch(setReviews(data.reviews))
      
    }
  },[data,dispatch])


  return (
    <div className="w-full mb-5 p-4 mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Guests Reviews</h2>
      <div className="flex justify-center mx-auto">
      {reviews.length && reviews[0].resortId == id ? (
          <Carousel
            opts={{
              align: "start",

            }}
            className="w-full max-w-5xl"
          >
            <CarouselContent>
              {reviews!.map((review) => (
                <CarouselItem key={review._id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1 h-full">
                    <Card className="h-full">
                      <CardContent className="flex flex-col items-center justify-center p-3">
                        {typeof review.userId !== 'string' &&
                          <div className="flex items-center w-full py-2 gap-3">
                            <Avatar>
                              <AvatarImage src={review.userId.avatar} />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <p>{review.userId.name}</p>
                          </div>
                        }
                        <div className="w-full text-wrap">
                          <p className="break-words">{review.reviewText}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
         ) : (
          <p className="text-blue-800 font-semibold text-lg">Nobody reviewed yet</p>
        )} 
      </div>
    </div>
  )
}

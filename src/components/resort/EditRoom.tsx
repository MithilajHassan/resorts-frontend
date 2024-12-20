import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useEditRoomMutation, useGetRoomQuery } from '../../slices/resortAdminApiSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { isApiError } from '../../utils/errorHandling';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const roomFormSchema = z.object({
    name: z.string().regex(/^[A-Z\sa-z]+$/, 'Room name must be letters').min(1, 'Room name is required'),
    numberOfGuests: z.string().regex(/^[1-9]\d*$/, 'Number of guests must be a valid number').min(1, 'At least 1 guest is required'),
    totalRooms: z.string().regex(/^[1-9]\d*$/, 'Total rooms must be a valid number').min(1, 'At least 1 room should be total'),
    normalPrice: z.string().regex(/^[1-9]\d*$/, 'Normal price must be a valid number').min(1, 'Normal price must be greater than 0'),
    offerPercentage: z.string().regex(/^(100|[1-9]?\d)$/, 'Offer percentage must be between 0 and 100'),
});

type RoomFormValues = z.infer<typeof roomFormSchema>

const EditRoom: React.FC = () => {
    const { id } = useParams()
    const { data:roomData } = useGetRoomQuery(id!)
    const [ editRoom ] = useEditRoomMutation()
    const navigate = useNavigate()
    const form = useForm<RoomFormValues>({
        resolver: zodResolver(roomFormSchema),
        defaultValues: {
            name: '',
            numberOfGuests: '',
            totalRooms: '',
            normalPrice: '',
            offerPercentage: '',
        },
    });

    useEffect(()=>{
        if(roomData){
            form.reset({
                name:roomData.name,
                numberOfGuests: String(roomData.numberOfGuests),
                totalRooms:String(roomData.totalRooms),
                normalPrice:String(roomData.normalPrice),
                offerPercentage:String(roomData.offerPercentage)
            })
        }
    },[roomData])

    const onSubmit = async (data: RoomFormValues) => {
        try{
            const {
                name,
                numberOfGuests,
                totalRooms,
                normalPrice,
                offerPercentage,
            } = data
            const room = await editRoom({
                id:id!,
                roomData:{
                    name,
                    resortId: roomData?.resortId!,
                    numberOfGuests: Number(numberOfGuests),
                    totalRooms: Number(totalRooms),
                    normalPrice: Number(normalPrice),
                    offerPercentage: Number(offerPercentage), 
                }
                
            })
            if (room) {
                navigate('/resort/rooms')
            }   
        } catch (err) {
            if (isApiError(err)) {
                toast(<div className="text-red-600">{err.data.message}</div>);
            } else {
                toast('Internal server error')
            }
        }
    }

    return (
        <div className="mx-auto mt-20">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 w-52 md:w-96">

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Room Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Room Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="numberOfGuests"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Number of Guests</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Enter number of guests"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="totalRooms"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Total Rooms</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Enter total rooms"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="normalPrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Normal Price</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Enter normal price"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="offerPercentage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Offer Percentage</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Enter offer percentage"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-400 text-white">
                        Edit Room
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default EditRoom;

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
import { useAddRoomMutation } from '../../slices/resortAdminApiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';

const roomFormSchema = z.object({
    name: z.string().regex(/^[A-Z\sa-z]+$/, 'Room name must be letters').min(1, 'Room name is required'),
    numberOfGuests: z.string().regex(/^[1-9]\d*$/, 'Number of guests must be a valid number').min(1, 'At least 1 guest is required'),
    totalRooms: z.string().regex(/^[1-9]\d*$/, 'Total rooms must be a valid number').min(1, 'At least 1 room should be total'),
    normalPrice: z.string().regex(/^[1-9]\d*$/, 'Normal price must be a valid number').min(1, 'Normal price must be greater than 0'),
    offerPercentage: z.string().regex(/^(100|[1-9]?\d)$/, 'Offer percentage must be between 0 and 100'),
});

type RoomFormValues = z.infer<typeof roomFormSchema>

const AddRoom: React.FC = () => {

    const { resortAdmin } = useSelector((state: RootState) => state.auth)
    const [addRoom] = useAddRoomMutation()
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


    const onSubmit = async (data: RoomFormValues) => {
        const {
            name,
            numberOfGuests,
            totalRooms,
            normalPrice,
            offerPercentage,
        } = data
        const room = await addRoom({
            name,
            resortId: resortAdmin?._id!,
            numberOfGuests: Number(numberOfGuests),
            totalRooms: Number(totalRooms),
            normalPrice: Number(normalPrice),
            offerPercentage: Number(offerPercentage),
        })
        if (room) {
            navigate('/resort/rooms')
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
                        Add Room
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default AddRoom;

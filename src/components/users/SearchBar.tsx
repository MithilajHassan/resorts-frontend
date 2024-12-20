import { format } from "date-fns";
import React, { FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAvailableRooms } from '../../slices/availableRoomsSlice'
import { setSearchParams } from '../../slices/searchSlice';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import MyDatePicker from './DatePicker';
import { useSearchRoomsMutation } from "../../slices/userApiSlice";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store";
import { isApiError } from "../../utils/errorHandling";

const SearchBar: React.FC<{ redirect?: string }> = ({ redirect }) => {
    const { search } = useSelector((state: RootState) => state.search)
    const [place, setPlace] = useState('');
    const [guestCount, setGuestCount] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [searchRoom] = useSearchRoomsMutation()

    useEffect(() => {
        if (search.place || search.checkIn || search.guestCount) {
            setPlace(search.place)
            setGuestCount(String(search.guestCount))
            setCheckIn(search.checkIn)
            setCheckOut(search.checkOut)
        }
    }, [])

    const submitHandler = async (e: FormEvent) => {
        e.preventDefault()
        try {
            if (!checkIn) {
                toast('Please select dates')
                return
            } else if (parseInt(guestCount) > 8) {
                toast("Guest count less than 8")
                return
            }
            dispatch(setSearchParams({
                place,
                guestCount: Number(guestCount),
                checkIn,
                checkOut
            }))

            const res = await searchRoom({
                query: {
                    place,
                    guestCount: Number(guestCount),
                    checkIn,
                    checkOut
                },
                page: 1
            }).unwrap()
            dispatch(setAvailableRooms(res))
            if (redirect) navigate(redirect)
        } catch (err) {
            if (isApiError(err)) {
                toast(err.data.message)
            }
        }

    }

    const handleSetCheckIn = (date: Date | undefined) => {
        setCheckIn(date ? format(date, "PP") : "")
    };

    const handleSetCheckOut = (date: Date | undefined) => {
        setCheckOut(date ? format(date, "PP") : "")

    }

    return (
        <div className="bg-blue-300 ">
            <ToastContainer />
            <form onSubmit={submitHandler} className="flex justify-center items-center relative p-2 space-x-1 sm:space-y-0 sm:space-x-2 mb-4">
                <Input
                    type="text"
                    className="bg-white w-full sm:w-auto"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    required={true}
                    placeholder="Where are you going?"
                />

                <Input
                    type="number"
                    className="bg-white w-54 sm:w-auto"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    placeholder="Guests"
                    required={true}
                    min={1}
                />

                <div className="flex sm:w-auto space-x-1 sm:space-y-0 sm:space-x-2">
                    <Input
                        type="text"
                        className="bg-white cursor-pointer"
                        value={checkIn ? format(checkIn, "PP") : "Check-in"}
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        required={true}
                        readOnly
                    />
                    <Input
                        type="text"
                        className="bg-white cursor-pointer"
                        value={checkOut ? format(checkOut, "PP") : "Check-out"}
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        readOnly
                    />
                </div>
                {showDatePicker && (
                    <div className="absolute z-10 shadow-lg rounded-lg bg-white p-2" style={{ top: '60px' }}>
                        <MyDatePicker
                            setCheckIn={handleSetCheckIn}
                            setCheckOut={handleSetCheckOut}
                        />
                    </div>
                )}



                <Button className="bg-blue-700 hover:bg-blue-500">
                    Search
                </Button>
            </form>
        </div>
    );
};

export default SearchBar;
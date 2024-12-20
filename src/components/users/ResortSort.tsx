import { useDispatch, useSelector } from "react-redux";
import { setSearchParams } from "../../slices/searchSlice";
import { useState } from "react";
import { RootState } from "../../store";
import { toast } from "react-toastify";
import { useSearchRoomsMutation } from "../../slices/userApiSlice";
import { setAvailableRooms } from "../../slices/availableRoomsSlice";
import { isApiError } from "../../utils/errorHandling";

const SortResorts = () => {
  const { place, guestCount, checkIn, checkOut, facilities, categories } = useSelector(
    (state: RootState) => state.search.search
  );
  const dispatch = useDispatch();
  const [sortBy, setSortBy] = useState<string>("");
  const [searchRoom] = useSearchRoomsMutation();

  const handleSortChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      const selectedSort = e.target.value;
      setSortBy(selectedSort);

      if (!place && !guestCount && !checkIn && !checkOut) {
        toast.error("Queries missing");
        return;
      }

      dispatch(
        setSearchParams({
          place,
          guestCount,
          checkIn,
          checkOut,
          sortBy: selectedSort,
          facilities: facilities ? facilities : undefined,
          categories: categories ? categories : undefined,
        })
      );

      const res = await searchRoom({
        query: {
          place,
          guestCount: guestCount!,
          checkIn,
          checkOut,
          sortBy: selectedSort,
          facilities: facilities ? facilities : undefined,
          categories: categories ? categories : undefined,
        },
        page:1
      }).unwrap();

      dispatch(setAvailableRooms(res));
    } catch (err) {
      if (isApiError(err)) {
        toast.error(err.data.message);
      }
    }
  };

  return (
    <div className="flex justify-end mb-4">
      <select value={sortBy} onChange={handleSortChange}>
        <option value="">Select Sort </option>
        <option value="name">Sort by Name</option>
        <option value="priceLowToHigh">Price low to high</option>
        <option value="priceHighToLow">Price high to low</option>
      </select>
    </div>
  );
};

export default SortResorts;

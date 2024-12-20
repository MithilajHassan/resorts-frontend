import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useListCategoriesQuery, useListFacilitiesQuery } from "../../slices/userApiSlice";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Form, FormField, FormItem, FormMessage } from "../ui/form";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useSearchRoomsMutation } from "../../slices/userApiSlice";
import { setSearchParams } from "../../slices/searchSlice";
import { setAvailableRooms } from "../../slices/availableRoomsSlice";
import { isApiError } from "../../utils/errorHandling";


const filterSchema = z.object({
  minPrice: z.string().regex(/^\d*$/, { message: "Enter a valid number" }).optional(),
  maxPrice: z.string().regex(/^\d*$/, { message: "Enter a valid number" }).optional(),
  facilities: z.array(z.string()),
  categories: z.array(z.string()),
}).refine(
  (data) => {
    const min = data.minPrice ? parseInt(data.minPrice, 10) : undefined
    const max = data.maxPrice ? parseInt(data.maxPrice, 10) : undefined
    if (min !== undefined && max !== undefined) {
      return min < max
    }
    if (min !== undefined && max == undefined) {
      return false
    }
    return true
  },
  {
    message: "Max price must be greater than min price",
    path: ["maxPrice"],
  }
)

type FilterFormValues = z.infer<typeof filterSchema>

const FilterSidebar = () => {
  const { data: facilitiesData = [] } = useListFacilitiesQuery()
  const { data: categoriesData = [] } = useListCategoriesQuery()

  const { place, guestCount, checkIn, checkOut, facilities, categories, sortBy } = useSelector((state: RootState) => state.search.search)
  const dispatch = useDispatch()
  const [searchRoom] = useSearchRoomsMutation()

  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      minPrice: "",
      maxPrice: "",
      facilities: facilities ? facilities : [],
      categories: categories ? categories : [],
    },
  });


  const onSubmit = async (values: FilterFormValues) => {
    try {
      const { minPrice, maxPrice, categories, facilities } = values
      if (!place && !guestCount && !checkIn && !checkOut) {
        toast.error('Queries missing')
        return
      }
      if (!minPrice && !maxPrice && !categories.length && !facilities.length) {
        toast.info("Please select any filter options")
        return
      }

      dispatch(setSearchParams({
        place,
        guestCount,
        checkIn,
        checkOut,
        minPrice: minPrice ? parseInt(minPrice, 10) : undefined,
        maxPrice: maxPrice ? parseInt(maxPrice, 10) : undefined,
        facilities,
        categories,
        sortBy
      }))

      const res = await searchRoom({
        query: {
          place,
          guestCount: guestCount!,
          checkIn,
          checkOut,
          minPrice: minPrice ? parseInt(minPrice, 10) : undefined,
          maxPrice: maxPrice ? parseInt(maxPrice, 10) : undefined,
          facilities,
          categories,
          sortBy
        },
        page: 1
      }).unwrap()

      dispatch(setAvailableRooms(res))
    } catch (err) {
      if (isApiError(err)) {
        toast(err.data.message)
      }
    }
  };

  return (
    <div className="w-full sm:w-1/4 py-4 bg-white border rounded-md h-full shadow-md ml-2">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 mx-4">Filters</h2>
      <hr className="mb-4 border-gray-200" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* <div className="mb-6 mx-4">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Price Range</h3>
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="minPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Min"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Max"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div> */}

          {/* <hr className="my-4 border-gray-200" /> */}

          <div className="mb-6 mx-4">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Amenities</h3>
            <FormField
              control={form.control}
              name="facilities"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-2 gap-2">
                    {facilitiesData.map((facility) => (
                      <Label className="flex items-center gap-2" key={facility._id}>
                        <Checkbox
                          value={facility._id}
                          checked={field.value.includes(facility._id)}
                          onCheckedChange={() => {
                            const newValue = field.value.includes(facility._id)
                              ? field.value.filter((item) => item !== facility._id)
                              : [...field.value, facility._id];
                            field.onChange(newValue);
                          }}
                        />
                        {facility.facilityName}
                      </Label>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <hr className="my-4 border-gray-200" />

          <div className="mb-6 mx-4">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Categories</h3>
            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-2 gap-2">
                    {categoriesData.map((category) => (
                      <Label className="flex items-center gap-2" key={category._id}>
                        <Checkbox
                          value={category._id}
                          checked={field.value.includes(category._id)}
                          onCheckedChange={() => {
                            const newValue = field.value.includes(category._id)
                              ? field.value.filter((item) => item !== category._id)
                              : [...field.value, category._id];
                            field.onChange(newValue);
                          }}
                        />
                        {category.name}
                      </Label>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-center">
            <Button type="submit" className="bg-blue-700 hover:bg-blue-400">
              Filter
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FilterSidebar;


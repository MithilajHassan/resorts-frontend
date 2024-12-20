import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { firebaseStore } from "../../config/firebaseConfig";
import { Checkbox } from "../ui/checkbox";
import { useListCategoriesQuery, useListFacilitiesQuery, useEditResortMutation } from "../../slices/resortAdminApiSlice";
import { useNavigate } from "react-router-dom";
import { Textarea } from "../ui/textarea";
import { isApiError } from "../../utils/errorHandling";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import MapSelector, { Location } from "../common/LocationSelecting";
import { editMyResort } from "../../slices/myResortSlice";

const formSchema = z.object({
    resortName: z.string().min(3, { message: "Resort name is required" })
        .max(50, { message: "Resort name cannot exceed 50 characters" })
        .regex(/^[A-Z\sa-z]+$/, { message: "Resort name should contain only letters" }),
    email: z.string().email({ message: "Invalid email address" }),
    address: z.string().min(10, { message: "Address is required" })
        .max(150, { message: "Address cannot exceed 150 characters" }),
    city: z.string().min(3, { message: "City is required" })
        .max(20, { message: "City name cannot exceed 20 characters" }),
    phone: z.string().regex(/^[0-9]{10,}$/, { message: "Phone number must be 10 digits" }),
    description: z.string().min(10, { message: "Description must be at least 10 characters" })
        .max(500, { message: "Description cannot exceed 500 characters" }),
    categories: z.array(z.string()).min(1, { message: "At least one category must be selected" }),
    facilities: z.array(z.string()).min(1, { message: "At least one facility must be selected" }),
    images: z.array(z.string()).optional(),
});

export default function ResortEditForm() {
    const { data: facilitiesOptions = [] } = useListFacilitiesQuery();
    const { data: categoriesOptions = [] } = useListCategoriesQuery();
    const { resort } = useSelector((state: RootState) => state.myResort)
    const [updateResort, { isLoading }] = useEditResortMutation();
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [location, setLocation] = useState<Location | null>(null)
    const [showMap, setShowMap] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            resortName: "",
            email: "",
            address: "",
            city: "",
            phone: "",
            description: "",
            categories: [],
            facilities: [],
            images: [],
        },
    });

    useEffect(() => {
        if (resort) {

            form.reset({
                resortName: resort.resortName,
                email: resort.email,
                address: resort.address,
                city: resort.city,
                phone: resort.phone,
                description: resort.description,
                categories: resort.categories.map((category) => typeof category === 'string' ? category : category._id),
                facilities: resort.facilities.map((facility) => typeof facility === 'string' ? facility : facility._id),
                images: resort.images,
            });
            setImagePreviews(resort.images);
            if (resort.location) {
                setLocation(resort.location)
            }
        }
    }, [resort]);

    const handleLocationSelect = (mark: Location) => {
        setLocation(mark)
        setShowMap(false)
        toast(<div className="text-green-600 text-sm">Location selected.</div>)
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {

            if (location == null) {
                toast(<div className="text-red-600 text-sm">Please select location</div>)
                return
            }

            const uploadedImageLinks: string[] = [...values.images!];

            const uploadPromises = newImages.map(async (image) => {
                const storageRef = ref(firebaseStore, `resorts/${image.name}`);
                await uploadBytes(storageRef, image);
                const downloadURL = await getDownloadURL(storageRef);
                uploadedImageLinks.push(downloadURL);
            });

            await Promise.all(uploadPromises);

            const result = await updateResort({
                resortData: {
                    resortName: values.resortName,
                    email: values.email,
                    address: values.address,
                    city: values.city,
                    phone: values.phone,
                    description: values.description,
                    categories: values.categories,
                    facilities: values.facilities,
                    images: uploadedImageLinks,
                    location
                },
                id: resort?._id!
            }).unwrap();

            if (result.success) {
                toast(<div className="text-green-500">Resort updated successfully!</div>);
                dispatch(editMyResort(result.data))
                navigate(`/resort/myresort`);
            }
        } catch (err) {
            if (isApiError(err)) {
                toast(<div className="text-red-600">{err.data.message}</div>);
            } else {
                toast('Internal server error')
            }
        }
    }

    const handleNewImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        const filePreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews((prev) => [...prev, ...filePreviews]);
        setNewImages((prev) => [...prev, ...files]);
    };

    const handleImageDelete = (index: number, imageUrl: string) => {
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
        form.setValue("images", form.getValues("images")!.filter((img) => img !== imageUrl));
        const imageRef = ref(firebaseStore, imageUrl);
        deleteObject(imageRef).catch(() => toast("Error deleting image"));
    };

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="flex flex-col items-center mt-16 w-full">
            {showMap && <div className="fixed z-10 top-20 border-2 bg-white ">
                <MapSelector location={location} onLocationSelect={handleLocationSelect} />
            </div>}
            <Form {...form}>
                <div className="shadow w-7/12 my-5 rounded-md">
                    <ToastContainer />
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 m-6 mx-12">
                        <h3 className="font-bold text-center text-xl">Edit Resort</h3>
                        <FormField
                            control={form.control}
                            name="resortName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Resort Name</FormLabel>
                                    <FormControl>
                                        <Input className="bg-indigo-50" placeholder="Enter resort name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input className="bg-indigo-50" placeholder="Enter email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input className="bg-indigo-50" placeholder="Enter address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input className="bg-indigo-50" placeholder="Enter city" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input className="bg-indigo-50" placeholder="Enter phone number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea className="bg-indigo-50" placeholder="Enter description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="categories"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Categories</FormLabel>
                                    <div className="flex flex-row flex-wrap gap-5">
                                        {categoriesOptions.map((category) => (
                                            <label key={category._id} >
                                                <Checkbox
                                                    value={category._id}
                                                    checked={field.value.includes(category._id)}
                                                    onCheckedChange={() => {
                                                        const newCategories = field.value.includes(category._id)
                                                            ? field.value.filter((item) => item !== category._id)
                                                            : [...field.value, category._id]
                                                        field.onChange(newCategories)
                                                    }}
                                                />
                                                <span className="ml-2">{category.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="facilities"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Facilities</FormLabel>
                                    <div className="flex flex-row flex-wrap gap-5">
                                        {facilitiesOptions.map((facility) => (
                                            <label key={facility._id}>
                                                <Checkbox
                                                    value={facility._id}
                                                    checked={field.value.includes(facility._id)}
                                                    onCheckedChange={() => {
                                                        const newFacilities = field.value.includes(facility._id)
                                                            ? field.value.filter((item) => item !== facility._id)
                                                            : [...field.value, facility._id]
                                                        field.onChange(newFacilities)
                                                    }}
                                                />
                                                <span className="ml-2">{facility.facilityName}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="form-group">
                            <label>Resort Images</label>
                            <div className="image-previews flex flex-wrap gap-1 mb-2">
                                {imagePreviews.map((imgUrl, idx) => (
                                    <div key={idx} className="preview-item">
                                        <img src={imgUrl} alt={`Preview ${idx}`} width="70" height="70" />
                                        <Button type="button" className="bg-red-600 hover:bg-red-400 w-full h-5 font-normal" onClick={() => handleImageDelete(idx, imgUrl)}>Delete</Button>
                                    </div>
                                ))}
                            </div>
                            <Input type="file" accept="image/*" multiple onChange={handleNewImageUpload} />
                        </div>

                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <button type="button" className="bg-indigo-50 py-1.5 text-sm font-semibold border rounded-md w-full" onClick={() => setShowMap(true)} >Change Your location</button>
                        </FormItem>

                        <Button type="submit" className="bg-blue-600 hover:bg-blue-500 w-full">EDIT</Button>
                    </form>
                </div>
            </Form>
        </div>
    );
}

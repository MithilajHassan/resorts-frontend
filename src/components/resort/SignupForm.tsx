import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { ToastContainer, toast } from "react-toastify"
import { useEffect, useState } from "react"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { firebaseStore } from "../../config/firebaseConfig"
import { Checkbox } from "../ui/checkbox"
import { useListCategoriesQuery, useListFacilitiesQuery } from "../../slices/resortAdminApiSlice"
import { useRegisterResortMutation } from "../../slices/authApiSlice"
import { useNavigate } from "react-router-dom"
import { Textarea } from "../ui/textarea"
import { isApiError } from "../../utils/errorHandling"
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import MapSelector, { Location } from "../common/LocationSelecting";

const formSchema = z.object({
    resortName: z.string().min(3, { message: "Resort name is required" })
        .max(50, { message: "Resort name cannot exceed 50 characters" })
        .regex(/^[A-Z\sa-z]+$/, { message: "Resort name should contain only letters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])[^\s]{4,18}$/, 
        { message: "Password must be at least 4 characters, contain at least one lowercase letter, one uppercase letter, one special character and one digit without space" }),
    address: z.string().min(10, { message: "Address is required" })
        .max(150, { message: "Address cannot exceed 150 characters" }),
    city: z.string().min(3, { message: "City is required" })
        .max(20, { message: "City name cannot exceed 20 characters" }),
    phone: z.string().regex(/^[0-9]{10,}$/, { message: "Phone number must be 10 digits" }),
    description: z.string().min(10, { message: "Description must be at least 10 characters" })
        .max(500, { message: "Description cannot exceed 500 characters" }),
    categories: z.array(z.string()).min(1, { message: "At least one category must be selected" }),
    facilities: z.array(z.string()).min(1, { message: "At least one facility must be selected" }),
    images: z.array(z.instanceof(File)).min(1, { message: "At least one image is required" })
})


export default function ResortRegistrationForm() {

    const { resortAdmin } = useSelector((state: RootState) => state.auth)
    const { data: facilitiesOptions = [] } = useListFacilitiesQuery()
    const { data: categoriesOptions = [] } = useListCategoriesQuery()
    const [registerResort] = useRegisterResortMutation()
    const navigate = useNavigate()
    const [imagePreviews, setImagePreviews] = useState<string[]>([])
    const [location, setLocation] = useState<Location | null>(null)
    const [showMap,setShowMap] = useState<boolean>(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            resortName: "",
            email: "",
            password: "",
            address: "",
            city: "",
            phone: "",
            description: "",
            categories: [],
            facilities: [],
            images: [],
        },
    })

    useEffect(() => {
        if (resortAdmin) {
            navigate('/resort/dashboard')
        }
    }, [])

    const handleLocationSelect = (mark:Location) => {
        setLocation(mark)        
        setShowMap(false)
        toast(<div className="text-green-600 text-sm">Location selected.</div>)
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if(location == null){
                toast(<div className="text-red-600 text-sm">Please select location</div>)
                return
            }
            const imageLinks: string[] = []

            const uploadPromises = values.images.map(async (image) => {
                const storageRef = ref(firebaseStore, `resorts/${image.name}`)
                await uploadBytes(storageRef, image);
                const downloadURL = await getDownloadURL(storageRef)
                imageLinks.push(downloadURL)
            })

            await Promise.all(uploadPromises)

            const result = await registerResort({
                resortName: values.resortName,
                email: values.email,
                password: values.password,
                address: values.address,
                city: values.city,
                phone: values.phone,
                description: values.description,
                categories: values.categories,
                facilities: values.facilities,
                images: imageLinks,
                location
            }).unwrap()
            if (result.success) {
                toast(<div className="text-green-500">Resort registered successfully!</div>)
                form.reset()
                setImagePreviews([])
                navigate('/resort/signin')
            }
        } catch (err) {
            if (isApiError(err)) {
                toast(<div className="text-red-600">{err.data.message}</div>)
            } else {
                console.log('An unexpected error occurred:', err)
            }
        }
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || [])
        const filePreviews = files.map(file => URL.createObjectURL(file))
        setImagePreviews(filePreviews)
        form.setValue("images", files)
    }

    return (
        <div className="flex flex-col items-center mt-16 w-full">
           {showMap && <div className="fixed z-10 top-20 border-2 bg-white ">
                <MapSelector location={location} onLocationSelect={handleLocationSelect} />
            </div>}
            <Form {...form}>
                <div className="shadow w-7/12 my-5 rounded-md">
                    <ToastContainer />
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 m-6 mx-12">
                        <h3 className="font-bold text-center text-xl">Register Resort</h3>
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
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input className="bg-indigo-50" type="password" placeholder="Enter password" {...field} />
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
                                        <Textarea
                                            className="bg-indigo-50"
                                            placeholder="Enter description"
                                            {...field}
                                            rows={4}
                                        />
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
                        <FormField
                            control={form.control}
                            name="images"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Images</FormLabel>
                                    <FormControl>
                                        <Input className="bg-indigo-50" type="file" multiple accept="image/*" onChange={handleImageUpload} />
                                    </FormControl>
                                    <FormMessage />
                                    <div className="mt-2 flex">
                                        {imagePreviews.map((image, index) => (
                                            <img key={index} src={image} alt="preview" className="w-20 h-20 mr-2" />
                                        ))}
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <button type="button" className="bg-indigo-50 py-1.5 text-sm font-semibold border rounded-md w-full" onClick={()=>setShowMap(true)} >Select Your Location</button>
                        </FormItem>

                        <div className="flex justify-center">
                            <Button className="bg-blue-700 hover:bg-blue-400" type="submit">Submit</Button>
                        </div>
                    </form>
                </div>
            </Form>
        </div>
    )
}































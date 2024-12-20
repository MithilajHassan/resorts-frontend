import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { firebaseStore } from "../../config/firebaseConfig"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { toast, ToastContainer } from 'react-toastify'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { useState } from 'react'
import { useCreateBannerMutation } from '../../slices/adminApiSlice'
import { addBanner } from '../../slices/bannerSlice'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useDispatch } from 'react-redux'

const bannerFormSchema = z.object({
    title: z.string().min(3, { message: "Title is required and must be at least 3 characters" })
        .max(100, { message: "Title cannot exceed 100 characters" }),
    description: z.string().min(10, { message: "Description must be at least 10 characters" })
        .max(400, { message: "Description cannot exceed 400 characters" }),
    image: z.instanceof(File, { message: "Image is Requried" }),
})

interface Props {
    setGetForm: React.Dispatch<React.SetStateAction<boolean>>
}

export default function BannerForm({ setGetForm }:Props) {

    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [createBanner] = useCreateBannerMutation()
    const dispatch = useDispatch()

    const form = useForm<z.infer<typeof bannerFormSchema>>({
        resolver: zodResolver(bannerFormSchema),
        defaultValues: {
            title: "",
            description: '',
        }
    })

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const img = new Image()
            img.src = URL.createObjectURL(file)

            img.onload = () => {
                const { width, height } = img
                const minWidth = 1300
                const minHeight = 400

                if (width >= minWidth && height >= minHeight) {
                    setImagePreview(img.src);
                    form.setValue('image', file)
                } else {
                    form.setError('image', {
                        type: 'manual',
                        message: `Image dimensions atleast ${minWidth}x${minHeight}px. Current dimensions: ${width}x${height}px.`,
                    })
                    setImagePreview(null)
                }
            };

            img.onerror = () => {
                form.setError('image', {
                    type: 'manual',
                    message: "Failed to load image. Please try again.",
                })
                setImagePreview(null)
            };
        }
    }

    const onSubmit = async (data: z.infer<typeof bannerFormSchema>) => {
        try {
            const storageRef = ref(firebaseStore, `bannerImages/${data.image.name}`)
            await uploadBytes(storageRef, data.image)
            const downloadURL = await getDownloadURL(storageRef)
    
            const res = await createBanner({
                title: data.title,
                description: data.description,
                imageUrl: downloadURL,
            }).unwrap()
    
            if (res._id) {
                dispatch(addBanner({
                    title: data.title,
                    description: data.description,
                    imageUrl: downloadURL,
                }))
                setGetForm(false)
                toast('Success')
            }
        } catch (error) {
            console.error("Error occurred during banner submission:", error)
        }
    }

    return (
        <div className="flex flex-col items-center mt-16 w-full">
            <Form {...form}>
                <div className="shadow w-7/12 my-5 rounded-md">
                    <ToastContainer />
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 m-6 mx-12">
                        <h3 className="font-bold text-center text-xl">Add Banner</h3>
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input className="bg-indigo-50" placeholder="Enter the title" {...field} />
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
                                        <Textarea rows={2} className="bg-indigo-50" placeholder="Enter description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="image"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Image</FormLabel>
                                    <FormControl>
                                        <Input className="bg-indigo-50" type="file" accept="image/*" onChange={handleImageUpload} />
                                    </FormControl>
                                    <FormMessage />
                                    {imagePreview && (
                                        <div className="mt-2">
                                            <img src={imagePreview} alt="preview" className="w-32 h-32" />
                                        </div>
                                    )}
                                </FormItem>
                            )}
                        />


                        <div className="flex justify-center">
                            <Button className="bg-blue-700 hover:bg-blue-400" type="submit">Submit</Button>
                        </div>

                    </form>
                </div>
            </Form>

        </div>
    )
}
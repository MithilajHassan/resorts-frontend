import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form';
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateUserMutation } from '../../slices/userApiSlice';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseStore } from "../../config/firebaseConfig"
import { setCredentials } from '../../slices/authSlice';
import { useNavigate } from 'react-router-dom';

const userSchema = z.object({
  name: z.string().regex(/^[A-Za-z\s]+$/, 'Name must only contain letters and spaces').min(1, 'Name is required'),
  phone: z.string().regex(/^[0-9]{10,}$/, { message: "Phone number must be 10 digits" }),
  avatar: z.instanceof(File).optional(),
});


const EditUserProfile = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: userInfo?.name || '',
      phone: userInfo?.phone ? String(userInfo?.phone) : '',
    },
  });

  const uploadImageToFirebase = async (file: File): Promise<string> => {

    const storageRef = ref(firebaseStore, `profilePictures/${file.name}`);
    setUploading(true);
    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setUploading(false);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploading(false);
      throw error;
    }
  };

  const onSubmit = async (data: z.infer<typeof userSchema>) => {
    try {
      let profilePictureUrl = userInfo?.avatar || '';

      if (data.avatar) {
        profilePictureUrl = await uploadImageToFirebase(data.avatar);
      }

      const res = await updateUser({
        id: userInfo?._id!,
        name: data.name,
        phone: Number(data.phone),
        avatar: profilePictureUrl
      }).unwrap()

      dispatch(setCredentials({
        _id: res.id!,
        name: res.name!,
        email: res.email,
        phone: res.phone,
        avatar: res.avatar
      }))

      navigate('/myprofile')
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-30 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Edit User Profile</h2>
      <Form {...form}>
        <form className="p-4 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input className="bg-indigo-50" placeholder="Enter name" {...field} />
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
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Picture</FormLabel>
                <FormControl>
                  <Input type="file" accept="image/*" onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.files?.[0])} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading || uploading} className="w-full bg-blue-500">
            {uploading ? 'Uploading...' : 'Update Profile'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditUserProfile

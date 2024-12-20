import { useEffect, useState } from "react";
import BannerForm from "./BannerForm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useDeleteBannerMutation, useListBannersQuery } from "../../slices/adminApiSlice";
import { deleteOneBanner, SetBanner } from "../../slices/bannerSlice";
import { Button } from "../ui/button";
import DeletConfirm from "../common/DeleteConfirm";
import { MdEdit } from "react-icons/md";



export default function BannersList() {
    const { data } = useListBannersQuery()
    const [getForm, setGetForm] = useState<boolean>(false)
    const { banners } = useSelector((state: RootState) => state.banners)
    const dispatch = useDispatch()
    const [deleteBanner] = useDeleteBannerMutation()

    useEffect(() => {
        if (data && banners.length === 0) {
            dispatch(SetBanner(data))
        }
    }, [data])

    const handleDelete = async (id:string)=>{
        const res = await deleteBanner(id).unwrap()
        if(res.message){
            dispatch(deleteOneBanner(id))
        }
    }

    return (
        <>
            {getForm ? (<BannerForm setGetForm={setGetForm} />) : (
                <div className="flex flex-col items-center mt-16 w-full">
                    <div className="flex justify-end my-4 w-7/12">
                        <Button
                            onClick={() => setGetForm(true)}
                            className="bg-blue-600 hover:bg-blue-400 text-white"
                        >
                            Add Banner
                        </Button>
                    </div>
                    <div className="w-7/12 border-2 rounded-md">
                        <Table className="w-full">
                            <TableHeader className="bg-blue-100 text-black h-12">
                                <TableRow>
                                    <TableHead className="text-black font-bold">Title</TableHead>
                                    <TableHead className="text-black font-bold">Image</TableHead>
                                    <TableHead className="text-black font-bold text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {banners.length ? (
                                    banners?.map((item) => (
                                        <TableRow className="h-10" key={item._id}>
                                            <TableCell className="font-medium">{item.title}</TableCell>
                                            <TableCell className="">
                                                <img src={item.imageUrl} alt="" className="w-20" />
                                            </TableCell>
                                            <TableCell className="text-right flex justify-end items-center gap-5">
                                                <MdEdit style={{ fontSize: '1.3rem' }} className="text-blue-700 hover:text-blue-400" />
                                                <DeletConfirm id={item._id!} onConfirm={handleDelete} />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center">Banners not found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}
        </>
    )
}
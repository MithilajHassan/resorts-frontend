import { useEffect, useState } from 'react'
import {
  useGetResortsQuery,
  useManageBlockUnblockResortMutation,
} from '../../slices/adminApiSlice'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'

import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import { IResort } from '../../types/types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { editResort, SetResorts } from '../../slices/resortsSlice';




export default function ResortDataTable() {

  const { data } = useGetResortsQuery()
  const { resorts } = useSelector((state: RootState) => state.resorts)
  const [manageResortBlock] = useManageBlockUnblockResortMutation()
  const [globalFilter, setGlobalFilter] = useState('')
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (data && resorts.length == 0) {
      dispatch(SetResorts(data!))
    }
  }, [data])

  const handleBlockUnblock = async (resortId: string, status: boolean) => {
    const action = status ? 'Block' : 'Unblock'
    const result = await Swal.fire({
      title: `Are you sure you want to ${action} this user?`,
      text: `This user will be ${action.toLowerCase()}ed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: status ? '#d33' : '#3085d6',
      cancelButtonColor: '#aaa',
      confirmButtonText: `Yes, ${action} them!`
    });

    if (result.isConfirmed) {
      try {
        const response = await manageResortBlock({ id: resortId, status }).unwrap()
        if (response.success) {
          dispatch(editResort(response.resort))
          toast(`The user has been ${action.toLowerCase()}ed successfully.`)
        }
      } catch (err) {
        console.error(`Error :`, err)
        toast(`There was a problem ${action.toLowerCase()}ing the user.`)
      }
    }
  }

  const columns: ColumnDef<IResort>[] = [
    {
      accessorKey: 'resortName',
      header: 'Resort Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
    },
    {
      accessorKey: 'city',
      header: 'City',
    },
    {
      header: 'Status',
      cell: ({ row }) => (
        <span
          className={`${row.original.isVerify ? 'text-green-600 font-bold' : 'text-red-600 font-bold'
            }`}
        >
          {row.original.isVerify ? 'Verified' : row.original.isRejected ? 'Rejected' : 'Unverified'}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <div>
          <Link to={`/admin/resorts/${row.original._id!}`}><button
            className={`px-3 py-1 text-sm rounded ms-2 text-white bg-blue-700 hover:bg-blue-700`}
          >{row.original.isVerify || row.original.isRejected ? "View" : "Verify"}</button></Link>
          <button
            onClick={() => handleBlockUnblock(row.original._id!, !row.original.isBlock)}
            className={`px-3 py-1 text-sm rounded ms-2 ${row.original.isBlock
              ? 'bg-red-600 text-white hover:bg-red-400'
              : 'bg-green-600 text-white hover:bg-green-400'
              }`}
          >
            {row.original.isBlock ? 'Unblock' : 'Block'}
          </button>
        </div>
      ),
    },
  ]


  const table = useReactTable({
    data: resorts,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })


  return (
    <div className="p-1 mt-16 flex justify-center w-full">
      <div>
        <ToastContainer />
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
          <input
            type="text"
            placeholder="Search..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="border p-2 rounded-md w-1/3"
          />

        </div>

        <div className="rounded-md border-2 w-full overflow-x-auto">
          <Table className='min-w-full'>
            <TableHeader className='bg-blue-100 h-12'>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className='text-balck'>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className='h-10'>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-4 py-2 bg-gray-300 rounded "
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-4 py-2 bg-gray-300 rounded "
            >
              Next
            </button>
          </div>
          <div>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
        </div>
      </div>
    </div>
  )
}


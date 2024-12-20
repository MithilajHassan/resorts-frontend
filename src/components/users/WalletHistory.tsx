import { format } from "date-fns"
import { IWalletHistory } from "../../types/types"
import { TiArrowDownThick } from "react-icons/ti";

type Props = {
    histories?: IWalletHistory[]
}

export default function WalletHistory({ histories }: Props) {
    return (
        <div className="w-full">
            <h2 className="text-lg font-bold mb-4">Wallet history</h2>
            {/* <div className="flex justify-around items-center w-full shadow-sm border rounded-md h-10 bg-blue-50 mb-3">
                <p></p>
                <p className="font-bold">Amount</p>
                <p className="font-bold">Type</p>
                <p className="font-bold">Date</p>
            </div> */}
            {
                histories && histories.length ? histories.map((history) => (
                    <div className="flex justify-around items-center w-full shadow-sm border rounded-md bg-blue-50 h-10 mb-1">
                        <p><TiArrowDownThick className={`size-6 ${history.type == 'Refund' ? "text-green-600" : "text-red-700"}`} /></p>
                        <p className="font-bold text-green-800">{history.amount}₹</p>
                        <p className="font-semibold">{history.type}</p>
                        <p className="font-semibold">{format(history.createdAt!, 'MM-dd-yyyy')}</p>
                    </div>
                )) : (
                    <div className="flex justify-center items-center w-full shadow-sm border rounded-md h-10">
                        <p className="font-bold">There is no history</p>
                    </div>
                )
            }

        </div>
    )
}
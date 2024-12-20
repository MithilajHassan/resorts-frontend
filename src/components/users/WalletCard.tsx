import { Card, CardContent } from "../ui/card"


type Props = {
    balance: number
}

export default function WalletCard({ balance }: Props) {
    return (
        <Card>
            <CardContent className="p-0">
                <div className="flex items-center ">
                    <div>
                        <img src="/images/Wallet.png" alt="" className="w-32 rounded-xl" />
                    </div>
                    <div className="text-center ps-6 pe-14">
                        <h3 className="text-lg font-bold">Wallet Balance</h3>
                        <p className="font-bold text-lg text-green-800" >{balance}₹</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
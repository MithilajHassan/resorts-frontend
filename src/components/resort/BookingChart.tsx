import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useGetChartDetailsMutation } from "../../slices/resortAdminApiSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface ChartData {
    day: number;
    count: number;
}

export default function BookingTrendsChart() {
    const { resortAdmin } = useSelector((state: RootState) => state.auth)
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [getChartData] = useGetChartDetailsMutation()

    const fetchChartData = async () => {
        try {
            const res = await getChartData({ resortId: resortAdmin?._id! }).unwrap()
            setChartData(res);
        } catch (error) {
            console.error("Failed to fetch chart data:", error);
        }
    };

    useEffect(() => {
        fetchChartData();
    }, []);

    return (
        <div className="w-full">
            <h2 className="text-center font-bold text-lg">Booking Trends - Current Month</h2>
            <ResponsiveContainer width="100%" height={350} >
                <LineChart data={chartData} >
                    <XAxis
                        dataKey="day"
                        label={{ value: "Day", position: "insideBottom", offset: -1, style: { fill: "black", fontWeight: "bold" } }}
                        tick={{ fill: "black" }}
                    />
                    <YAxis
                        label={{ value: "Bookings", angle: -90, position: "insideLeft", style: { fill: "black", fontWeight: "bold" } }}
                        tick={{ fill: "black" }}
                        allowDecimals={false}
                    />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

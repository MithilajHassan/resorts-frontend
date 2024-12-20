import { useEffect, useState } from "react";
import { Bar, BarChart, XAxis, YAxis, Tooltip } from "recharts";
import { useGetChartDetailsMutation } from "../../slices/adminApiSlice";

interface ChartData {
  resort: string;
  bookings: number;
}

export function ResortsChart() {
  const [getChartDetails] = useGetChartDetailsMutation()
  const [chartData, setChartData] = useState<ChartData[]>([])

  useEffect(() => {
    async function fetchChartData() {
      try {
        const data = await getChartDetails().unwrap()
        const transformedData = data.map((item: ChartData, index: number) => ({
          resort: item.resort,
          bookings: item.bookings,
          fill: `hsl(${(index * 50) % 360}, 70%, 50%)`, 
        }));
        setChartData(transformedData);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      }
    }

    fetchChartData();
  }, [getChartDetails]);

  if (!chartData.length) {
    return <p>Loading chart data...</p>; 
  }

  return (
    <div className="shadow-md p-3 rounded-md" style={{ maxWidth: "600px", margin: "auto" }}>
      <h3 className="text-center text-lg font-semibold">Resort Bookings</h3>
      <BarChart
        width={500}
        height={300}
        data={chartData}
        layout="vertical"
      >
        <YAxis
          dataKey="resort"
          type="category"
          tickLine={false}
          axisLine={false}
          width={150}
        />
        <XAxis
          dataKey="bookings"
          type="number"
          tickLine={false}
          axisLine={false}
        />
        <Tooltip />
        <Bar dataKey="bookings" radius={4} />
      </BarChart>
    </div>
  );
}

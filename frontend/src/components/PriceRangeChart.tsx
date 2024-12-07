import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Product } from '../types/product';
import { calculatePriceRanges } from '../utils/priceRangeUtil';

interface PriceRangeChartProps {
  products: Product[];
  selectedMonth: string;
}

export function PriceRangeChart({ products, selectedMonth }: PriceRangeChartProps) {
  const chartData = useMemo(() => {
    const filteredProducts = products.filter(product => {
      if (!selectedMonth) return true;
      const date = new Date(product.dateOfSale);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      return month === selectedMonth;
    });

    const prices = filteredProducts.map(product => product.price);
    return calculatePriceRanges(prices);
  }, [products, selectedMonth]);

  if (chartData.length === 0) {
    return (
      <div className="mt-8 p-4 text-center text-gray-500 dark:text-gray-400">
        No data available for the selected month
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Price Range Distribution
        {selectedMonth && ` for ${new Date(2024, parseInt(selectedMonth) - 1).toLocaleString('default', { month: 'long' })}`}
      </h2>
      <div className="h-[400px] w-full text-gray-900 dark:text-gray-100">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="range"
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
              tick={{ fill: 'currentColor', fontSize: 12 }}
            />
            <YAxis tick={{ fill: 'currentColor' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            <Bar
              dataKey="count"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
              name="Number of Items"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
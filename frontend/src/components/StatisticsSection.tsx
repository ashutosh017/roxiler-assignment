import { DollarSign, ShoppingBag, ShoppingCart } from 'lucide-react';
import type { Statistics } from '../utils/statisticsUtils';

interface StatisticsSectionProps {
  statistics: Statistics;
  selectedMonth: string;
}

export function StatisticsSection({ statistics, selectedMonth }: StatisticsSectionProps) {
  const monthName = selectedMonth 
    ? new Date(2024, parseInt(selectedMonth) - 1).toLocaleString('default', { month: 'long' })
    : 'All Time';

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Statistics for {monthName}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sales</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                ${statistics.totalSales.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Sold Items</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {statistics.soldItems}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Not Sold Items</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {statistics.notSoldItems}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
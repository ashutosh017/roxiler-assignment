import type { Product } from '../types/product';

export interface Statistics {
  totalSales: number;
  soldItems: number;
  notSoldItems: number;
}

export function calculateStatistics(products: Product[], selectedMonth: string): Statistics {
  const filteredProducts = products.filter(product => {
    if (!selectedMonth) return true;
    const date = new Date(product.dateOfSale);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return month === selectedMonth;
  });

  const soldItems = filteredProducts.filter(product => product.sold).length;
  const totalSales = filteredProducts
    .filter(product => product.sold)
    .reduce((sum, product) => sum + product.price, 0);

  return {
    totalSales,
    soldItems,
    notSoldItems: filteredProducts.length - soldItems
  };
}
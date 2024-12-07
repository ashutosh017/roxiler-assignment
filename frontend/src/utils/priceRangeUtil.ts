export interface PriceRangeData {
    range: string;
    count: number;
  }
  
  export function calculatePriceRanges(prices: number[]): PriceRangeData[] {
    if (prices.length === 0) return [];
  
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min;
    const step = range / 4; // Divide into 5 ranges
  
    const ranges: { [key: string]: number } = {
      [`$${min.toFixed(2)} - $${(min + step).toFixed(2)}`]: 0,
      [`$${(min + step).toFixed(2)} - $${(min + 2 * step).toFixed(2)}`]: 0,
      [`$${(min + 2 * step).toFixed(2)} - $${(min + 3 * step).toFixed(2)}`]: 0,
      [`$${(min + 3 * step).toFixed(2)} - $${(min + 4 * step).toFixed(2)}`]: 0,
      [`$${(min + 4 * step).toFixed(2)} - $${max.toFixed(2)}`]: 0,
    };
  
    prices.forEach(price => {
      if (price >= min && price < min + step) {
        ranges[`$${min.toFixed(2)} - $${(min + step).toFixed(2)}`]++;
      } else if (price >= min + step && price < min + 2 * step) {
        ranges[`$${(min + step).toFixed(2)} - $${(min + 2 * step).toFixed(2)}`]++;
      } else if (price >= min + 2 * step && price < min + 3 * step) {
        ranges[`$${(min + 2 * step).toFixed(2)} - $${(min + 3 * step).toFixed(2)}`]++;
      } else if (price >= min + 3 * step && price < min + 4 * step) {
        ranges[`$${(min + 3 * step).toFixed(2)} - $${(min + 4 * step).toFixed(2)}`]++;
      } else {
        ranges[`$${(min + 4 * step).toFixed(2)} - $${max.toFixed(2)}`]++;
      }
    });
  
    return Object.entries(ranges).map(([range, count]) => ({ range, count }));
  }
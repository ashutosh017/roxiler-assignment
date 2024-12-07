import { useEffect, useState } from "react";
import axios from "axios";
import { ProductTable } from './components/ProductTable';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import type { Product } from './types/product';

function App() {
  const backend_url = import.meta.env.VITE_BE_URL ?? "http://localhost:3000";
  const [data, setData] = useState<Product[]>([]);

  const fetchData = async () => {
    try {
        const localData = localStorage.getItem("roxiller-data");
        if(!localData){

          const resp = await axios.get(`${backend_url}/api/v1/data`);
          // const resp = await axios.get(`https://s3.amazonaws.com/roxiler.com/product_transaction.json`)
          setData(resp.data);
          localStorage.setItem("roxiller-data",JSON.stringify(resp.data));
        }else{
            setData(JSON.parse(localData))
        }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ThemeProvider>
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
            <ThemeToggle />
          </div>
          <ProductTable products={data} />
        </div>
      </div>
    </div>
  </ThemeProvider>
  )
}

export default App;

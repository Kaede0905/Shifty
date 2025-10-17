import { useEffect, useState } from "react";

type Store = {
  id: number,
  company_id: number;
  name: string;
  invite_code: string;
  address?: string;
  phone_number?: string;
  status: string;
  logo_url?: string;
  store_type?: string;
};

export const usePullStoreInfo = () => {
  const API_URL = import.meta.env.VITE_API_URL
  const [stores,setStores] = useState<Store[]>([]);
  useEffect(()=>{
    const pull = async () =>{
      try{
        const res = await fetch(`${API_URL}/api/v1/employee/store_info`,{ 
          credentials: "include" 
        });
        const data = await res.json();

        if (res.ok && data.pullStoreInfo) {
          setStores(data.stores);
        }
      }catch(error){
         console.error(error);
         setStores([]);
      }
    }
    pull();
  },[]);
  return { stores, setStores };
}
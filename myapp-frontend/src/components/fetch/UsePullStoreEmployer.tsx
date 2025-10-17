import { useEffect, useState } from "react";
type Stores = {
  id: number;
  company_id: number;
  name: string;
  invite_code: string;
  address?: string;
  status?: string;
  phone_number?: string;
  logo_url?: string;
  store_type: string;
}
type User = {
  id: number;
  company_id: number;
  name: string;
  email: string;
  role: string;
  image_url: string;
}
export const UsePullStoreEmployer = () => {
  const API_URL = import.meta.env.VITE_API_URL
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stores, setStores] = useState<Stores[]>([]);
  const [user, setUser] = useState<User>();
  useEffect(()=>{
    const fetchShifts = async() =>{
      try{
        const res = await fetch(`${API_URL}/api/v1/stores/pull`,{
          credentials: "include",
          method: "GET",
        })
        if (!res.ok) throw new Error("シフト情報の取得に失敗しました");
        const data = await res.json();
        console.log(data.stores)
        setUser(data.user);
        setStores(data.stores)
      }catch (e: any) {
        setError(e.message);
      }finally {
        setLoading(false);
      }
    }
    fetchShifts();
  },[])
  return { user, stores, loading, error }
}
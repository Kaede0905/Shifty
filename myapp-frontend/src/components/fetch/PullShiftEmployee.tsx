import { useEffect, useState } from "react";

interface Shift {
  day: string;
  time: string[] | null;
  confirmed: boolean;
}

export const PullShiftsEmployee = (storeId: number, currentSunday: string, currentSaturday: string) =>{
  const API_URL = import.meta.env.VITE_API_URL
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shifts, setShifts] = useState<Shift[]>([]);
  useEffect(()=>{
    const fetchShifts = async() =>{
      try{
        const res = await fetch(`${API_URL}/api/v1/shift/calender`,{
          credentials: "include",
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            store_id: storeId,
            currentSunday: currentSunday,
            currentSaturday: currentSaturday,
          }),
        })
        if (!res.ok) throw new Error("シフト情報の取得に失敗しました");
        const data = await res.json();
        setShifts(data.result);
      }catch (e: any) {
        setError(e.message);
      }finally {
        setLoading(false);
      }
    }
    fetchShifts();
  },[storeId, currentSunday ,currentSaturday])
  return { shifts, setShifts, loading, error }
}
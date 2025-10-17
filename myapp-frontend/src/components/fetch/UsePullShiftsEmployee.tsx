import { useEffect, useState } from "react";

type Cell = { h: number; m: number };
type Range = { start: Cell; end: Cell; type: "unsaved" | "saved" | "submit" | "approved" | "rejected"};
type Shifts = { [date: string]: Range[] };

export const UsePullShiftsEmployee = (storeId: number, year: number, month: number) =>{
  const API_URL = import.meta.env.VITE_API_URL
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shifts, setShifts] = useState<Shifts>({});
  useEffect(()=>{
    const fetchShifts = async() =>{
      try{
        const res = await fetch(`${API_URL}/api/v1/shift?store_id=${storeId}&year=${year}&month=${month}`,{
          credentials: "include",
          method: "GET",
        })
        if (!res.ok) throw new Error("シフト情報の取得に失敗しました");
        const data: Shifts = await res.json();
        setShifts(data);
      }catch (e: any) {
        setError(e.message);
      }finally {
        setLoading(false);
      }
    }
    fetchShifts();
  },[storeId, year, month])
  return { shifts, setShifts, loading, error }
}
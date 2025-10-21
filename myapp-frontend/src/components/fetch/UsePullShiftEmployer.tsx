import { useState, useEffect } from "react";

type Shift = {
  id: number;
  employee_account_id: number;
  employee_account_name: string;
  store_connect_id: number;
  work_date: string | null;
  start_time: string | null;
  end_time: string | null;
  status: "draft" | "approved" | "rejected" | string;
  note: string | null;
}

export const UsePullShiftEmployer = (refetchFlag?: number, id?: string) => {
  const API_URL = import.meta.env.VITE_API_URL
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shifts, setShifts] = useState<Shift[]>([]);

  useEffect(()=>{
    const fetchShifts = async() =>{
      try{
        const res = await fetch(`${API_URL}/api/v1/shift/pull/employer?store_id=${id}`,{
          credentials: "include",
          method: "GET",
        })
        if (!res.ok) throw new Error("シフト情報の取得に失敗しました");
        const data = await res.json();
        setShifts(data.shifts ?? []);
      }catch (e: any) {
        setError(e.message);
      }finally {
        setLoading(false);
      }
    }
    fetchShifts();
  },[refetchFlag])
  return { shifts, loading, error }
}
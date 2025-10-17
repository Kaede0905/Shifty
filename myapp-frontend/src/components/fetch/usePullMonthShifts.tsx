import { useEffect, useState } from "react";

type Shift = { time: string; status: string };
type Shifts = Record<string, Shift[]>;

export const usePullMonthShifts = (storeId: number, startDate: string, endDate: string) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [shiftsInfo, setShifts] = useState<Shifts>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/shift/month`, {
          credentials: "include",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ store_id: storeId, startDate, endDate }),
        });

        if (!res.ok) throw new Error("シフト取得失敗");

        const data = await res.json();

        // ここを data.result じゃなく data に変更
        setShifts(data);
        console.log("shifts fetched:", data);

      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShifts();
  }, [storeId, startDate, endDate]);

  return { shiftsInfo, loading, error };
};

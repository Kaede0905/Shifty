import { useEffect, useState } from "react"

interface EmployeeData {
  id: number;
  assign_id: number;
  name: string;
  image_url: string;
  salary: number;
  night_salary: number;
  role: string;
}

export const UsePullstoreEmployee = (storeId: number, refetchFlag: number) => {
  const [users, setUsers] = useState<EmployeeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storeId) return;

    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API_URL}/api/v1/stores/${storeId}/employees?storeId=${storeId}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("従業員データの取得に失敗しました");

        const data = await res.json();
        setUsers(data.users ?? []); // APIの返却形式に合わせて調整
        setError(null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("不明なエラーが発生しました");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [storeId,refetchFlag]);

  return { users, loading, error };
};

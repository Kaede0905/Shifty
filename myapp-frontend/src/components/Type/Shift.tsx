export type Shift = {
  id: number;
  employee_account_id: number;
  employee_account_name?: string; // Rails側でマージしてる名前
  store_connect_id: number;
  work_date: string | null;       // "2025-10-09" 形式
  start_time: string | null;      // "17:30" 形式
  end_time: string | null;        // "21:00" 形式
  status: "draft" | "approved" | "rejected" | string;
  note?: string | null;
};

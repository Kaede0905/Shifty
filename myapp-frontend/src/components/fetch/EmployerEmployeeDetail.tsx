import { toast } from "sonner";

type EmployeeData = {
  id: number;
  assign_id: number;
  name: string;
  image_url: string;
  salary: number;
  night_salary: number;
  role: string;
}

type Props = {
  refetchFlag: number;
  setRefetchFlag: React.Dispatch<React.SetStateAction<number>>;
}

export const EmployerEmployeeDetail = async (employee: EmployeeData, {refetchFlag, setRefetchFlag}: Props) => {
  const API_URL = import.meta.env.VITE_API_URL;
  try {
    const res = await fetch(`${API_URL}/api/v1/employee/employer/detail_edit`, {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employee }), // employeeをそのまま送信
    });
    const data = await res.json();
    if (res.ok) {
      toast("更新完了",{ description: "従業員の情報更新を行いました" })
      setRefetchFlag(refetchFlag += 1);
    }else if(data.errors){
      toast("更新失敗", {
        description: data.errors,
        action: {
          label: "閉じる",
          onClick: () => console.log("Undo"),
        },
      });
    }
  } catch (error) {
    toast("通信エラー", { description: "サーバーに接続できませんでした" });
  }
};
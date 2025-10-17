import type { Shift } from "../Type/Shift"
import { toast } from "sonner"

type Props = {
  refetchFlag: number;
  setRefetchFlag: React.Dispatch<React.SetStateAction<number>>;
}

export const EmployerShiftCD = ({refetchFlag, setRefetchFlag}:Props) =>{
  const API_URL = import.meta.env.VITE_API_URL
  const clickDelete = async(shift: Shift) => {
    try{
      const res = await fetch(`${API_URL}/api/v1/shift/employer/delete`,{
        credentials: "include",
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          shift: shift
        })
      })
      const data = await res.json();
      if(res.ok){
        toast("消去完了",{ description: "シフトの削除を行いました" })
        setRefetchFlag(refetchFlag + 1)
      }else if(data.errors){
        toast("消去失敗", {
          description: data.errors,
          action: {
            label: "閉じる",
            onClick: () => console.log("Undo"),
          },
        });
      }
    }catch{
      toast("通信エラー", { description: "サーバーに接続できませんでした" });
    }
  }
  const clickConfirm = async(shift: Shift) => {
    try{
      const res = await fetch(`${API_URL}/api/v1/shift/employer/confirm`,{
        credentials: "include",
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          shift: shift
        })
      })
      const data = await res.json();
      if(res.ok){
        toast("承認完了",{ description: "シフトの承認を行いました" })
        setRefetchFlag(refetchFlag + 1)
      }else if(data.errors){
        toast("承認失敗", {
          description: data.errors,
          action: {
            label: "閉じる",
            onClick: () => console.log("Undo"),
          },
        });
      }
    }catch{
      toast("通信エラー", { description: "サーバーに接続できませんでした" });
    }
  }
  return { clickDelete, clickConfirm };
}
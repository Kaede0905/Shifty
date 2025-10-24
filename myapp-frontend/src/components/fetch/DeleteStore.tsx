import { toast } from "sonner";

export const DeleteStore = (assign_id: number) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const deleteS = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/stores/delete?assign_id=${assign_id}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok && !data.errors) {
        toast("消去成功", { description: "店舗の削除に成功しました" });
      } else {
        const errorMsg = data.errors ? data.errors.join?.(", ") ?? data.errors : "削除失敗";
        toast("削除失敗", {
          description: errorMsg,
          action: { label: "閉じる", onClick: () => console.log("閉じる") },
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast("通信エラー", { description: error.message });
      } else {
        toast("通信エラー", { description: "サーバーに接続できませんでした" });
      }
    }
  };

  return { deleteS };
};

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Store = {
  id: number,
  company_id: number;
  name: string;
  invite_code: string;
  address?: string;
  phone_number?: string;
  status: string;
  logo_url?: string;
  store_type?: string;
};

type Employee ={
  id: number;
  assign_id: number;
  name: string;
  image_url?: string;
  salary?: number;
  night_salary?: number;
  role?: string;
}

interface EmployerEditStoreProps {
  editMenuOpen: boolean;
  setEditMenuOpen: (open: boolean) => void;
  store: Store;
  user: Employee;
  refetchFlag: number;
  setRefetchFlag: React.Dispatch<React.SetStateAction<number>>;
}

export const EmployeeEditStore = ({
  editMenuOpen,
  setEditMenuOpen,
  store,
  user,
  refetchFlag,
  setRefetchFlag
}: EmployerEditStoreProps) => {
  const [name, setName] = useState(store.name);
  const [address, setAddress] = useState(store.address ?? "");
  const [phone, setPhone] = useState(store.phone_number ?? "");
  const [salary, setSalary] = useState(user?.salary);
  const [night_salary, setNight_salary] = useState(user?.night_salary);
  const [role, setRole] = useState(user.role ?? "");
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // ← フォームの自動リロードを防止
    const API_URL = import.meta.env.VITE_API_URL;
    // ✅ 入力チェック
    if (!name) {
      alert("店舗名を入力してください");
      return;
    }

    try {
      // ✅ PATCHリクエストで更新
      const res = await fetch(`${API_URL}/api/v1/stores/update_employee/${store.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assign_id: user.assign_id,
          name: name,
          address: address,
          phone_number: phone,
          salary: salary,
          night_salary: night_salary,
          role: role
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("店舗を編集しました！");
        setEditMenuOpen(false);
        setRefetchFlag(refetchFlag + 1)
      } else {
        toast.error("店舗の編集に失敗しました");
        console.error("更新失敗:", data);
      }
    } catch (error) {
      console.error("通信エラー:", error);
      toast.error("通信エラーが発生しました");
    }
  };
  return (
    <AnimatePresence>
      {editMenuOpen && (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* ✅ 背景ぼかし：クリックで閉じる */}
          <div
            className="absolute inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm pointer-events-auto"
            onClick={() => setEditMenuOpen(false)}
          />

          {/* ✅ モーダル本体：操作できる */}
          <motion.div
            key="modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative z-50 bg-white rounded-2xl shadow-xl p-6 w-11/12 max-w-md pointer-events-auto"
            onClick={(e) => e.stopPropagation()} // ← 背景クリックイベントを伝搬させない！
          >
            <button
              onClick={() => setEditMenuOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={24} />
            </button>

            <h2 className="text-xl font-semibold mb-4">店舗情報編集</h2>

            {/* ✅ フォーム部分 */}
            <form className="space-y-3">
              <fieldset disabled={store.store_type === "with_id"}>
                <div>
                  <label className="block text-sm text-gray-600">店舗名</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600">住所</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600">電話番号</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </fieldset>
              {/* 従業員関連 */}
              <hr className="my-4" />
              <h3 className="text-lg font-semibold text-gray-700">従業員設定</h3>

              <div>
                <label className="block text-sm text-gray-600">給与（時給）</label>
                <input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(Number(e.target.value))}
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="例: 1200"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600">夜間給与（時給）</label>
                <input
                  type="number"
                  value={night_salary}
                  onChange={(e) => setNight_salary(Number(e.target.value))}
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="例: 1500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600">役職</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="例: 店長 / アルバイト"
                />
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  onClick={handleClick}
                >
                  保存
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

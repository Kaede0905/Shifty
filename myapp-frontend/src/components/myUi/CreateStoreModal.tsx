// CreateStoreModal.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "sonner";

interface StoreType {
  id: number;
  name: string;
  address?: string;
  phone_number?: string;
}

interface Props {
  openCreateModal: boolean;
  setCreateModal: React.Dispatch<React.SetStateAction<boolean>>;
  refetchFlag: number;
  setRefetchFlag: React.Dispatch<React.SetStateAction<number>>;
  setStoreModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateStoreModal = ({
  openCreateModal,
  setCreateModal,
  refetchFlag,
  setRefetchFlag,
  setStoreModal
}: Props) => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState<Omit<StoreType, "id">>({
    name: "",
    address: "",
    phone_number: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name) {
      toast.error("店舗名は必須です");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/stores/create`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("店舗作成に失敗しました");
      toast.success("店舗を作成しました！");
      setRefetchFlag(refetchFlag + 1);
      setCreateModal(false);
      setStoreModal(true);
    } catch (err) {
      toast.error("店舗の作成に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {openCreateModal && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white w-[90%] max-w-lg rounded-2xl shadow-lg p-6 relative"
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">店舗を新規作成</h2>
              <button
                onClick={() => {setCreateModal(false); setStoreModal(true);}}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-3">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="店舗名"
                className="w-full border rounded-lg px-3 py-2 outline-none"
              />
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="住所（任意）"
                className="w-full border rounded-lg px-3 py-2 outline-none"
              />
              <input
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                placeholder="電話番号（任意）"
                className="w-full border rounded-lg px-3 py-2 outline-none"
              />
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setCreateModal(false)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-white ${
                  loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "作成中..." : "作成"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateStoreModal;

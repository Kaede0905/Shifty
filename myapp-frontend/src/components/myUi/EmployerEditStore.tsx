import { motion, AnimatePresence } from "framer-motion";
import type { StoreType } from "../Type/StoreType";
import { X } from "lucide-react";

interface EmployerEditStoreProps {
  editMenuOpen: boolean;
  setEditMenuOpen: (open: boolean) => void;
  store: StoreType;
}

export const EmployerEditStore = ({
  editMenuOpen,
  setEditMenuOpen,
  store,
}: EmployerEditStoreProps) => {
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
              <div>
                <label className="block text-sm text-gray-600">店舗名</label>
                <input
                  type="text"
                  defaultValue={store.name}
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600">住所</label>
                <input
                  type="text"
                  defaultValue={store.address ?? ""}
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600">電話番号</label>
                <input
                  type="text"
                  defaultValue={store.phone_number ?? ""}
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
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

// StoreModal.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Store, Edit } from "lucide-react";

type Store = {
  id: number;
  name: string;
  address?: string;
};

interface StoreModalProps {
  openStoreModal: boolean;
  setStoreModal: React.Dispatch<React.SetStateAction<boolean>>;
  stores: Store[];
  onSelect: (store: Store) => void;
}

const StoreModal: React.FC<StoreModalProps> = ({ openStoreModal, setStoreModal, stores, onSelect }) => {
  const [query, setQuery] = useState("");

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {openStoreModal && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-lg w-[90%] max-w-lg p-6 relative"
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {/* ヘッダー */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">店舗を選択・編集</h2>
              <button
                onClick={()=>setStoreModal(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 検索バー */}
            <div className="flex items-center gap-2 mb-4 border rounded-lg px-3 py-2">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="店舗名で検索..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full outline-none"
              />
            </div>

            {/* 店舗リスト */}
            <div className="max-h-80 overflow-y-auto space-y-2">
              {filteredStores.length > 0 ? (
                filteredStores.map((store) => (
                  <motion.div
                    key={store.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <Store className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-semibold">{store.name}</p>
                        {store.address && (
                          <p className="text-sm text-gray-500">{store.address}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => onSelect(store)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                      編集
                    </button>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-6">該当する店舗がありません</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StoreModal;

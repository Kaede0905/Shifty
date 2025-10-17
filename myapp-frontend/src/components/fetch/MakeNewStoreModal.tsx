import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { KeyRound, Store } from "lucide-react";
import { toast } from "sonner"
import { SuccessDialogExample } from "../myUi/SuccessDialogExample";

type MakeNewStoreModalProps = {
  isModalOpen: boolean;
  setModalOpen: (open: boolean) => void;
};

const MakeNewStoreModal = ({ isModalOpen, setModalOpen }: MakeNewStoreModalProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [message, setMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;
  const [pubError, setPub] = useState(false);
  const [nameError, setName] = useState(false);
  const [newStore, setNewStore] = useState({
    mode: "withId", // withId or withoutId
    publicId: "",
    name: "",
  });
  const handleAddStore = async() => {
    setPub(false);
    setName(false);
    if (newStore.mode === "withId" && !newStore.publicId.trim()) {
      setPub(true);
      toast("店舗公開IDを入力してください");
      return;
    }
    if (newStore.mode === "withoutId" && !newStore.name.trim()) {
      setName(true);
      toast("店舗名を入力してください");
      return;
    }
    try{
      const res = await fetch(`${API_URL}/api/v1/stores/employee_create`,{
        method: "POST",
        credentials: "include",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          employer_store: {
            mode: newStore.mode,
            publicId: newStore.publicId,
            name: newStore.name,
          }
        })
      })
      const data = await res.json();
      if (res.ok){
        setMessage(data.message);
        setModalOpen(false);
        setOpenDialog(true);
        
      }else if(data.errors){
        toast("登録失敗", {
            description: data.errors,
            action: {
              label: "閉じる",
              onClick: () => console.log("Undo"),
            },
          });
        if(data.error_type == "with_id"){
          setPub(true);
        }else{
          setName(true);
        }
      }
    }catch(error){
      toast("通信エラー", { description: "サーバーに接続できませんでした" });
    }
  };

  return (
    <>
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
                勤務先を追加
              </h2>

              {/* 選択肢 */}
              <div className="flex justify-center gap-4 mb-6">
                {[
                  { value: "withId", label: "公開IDをお持ちの方", icon: <KeyRound className="h-4 w-4" /> },
                  { value: "withoutId", label: "公開IDをお持ちでない方", icon: <Store className="h-4 w-4" /> },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setNewStore({ ...newStore, mode: option.value })}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition
                      ${newStore.mode === option.value
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>

              {/* フォーム */}
              <div className="space-y-4">
                {newStore.mode === "withId" ? (
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      店舗公開ID
                    </label>
                    <input
                      type="text"
                      value={newStore.publicId}
                      onChange={(e) => setNewStore({ ...newStore, publicId: e.target.value })}
                      className = {`
                        w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition
                          ${
                          pubError
                            ? " border-red-500"
                            : ""
                          }
                      `}
                      placeholder="例: ABC12345"
                    />
                  </div>
                ) : (
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      店舗名
                    </label>
                    <input
                      type="text"
                      value={newStore.name}
                      onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                      className={`
                        w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition
                        ${
                          nameError
                            ? " border-red-500"
                            : ""
                        }
                      `}
                      placeholder="例: リンゴ酒場"
                    />
                  </div>
                )}
              </div>

              {/* ボタン */}
              <div className="flex justify-between mt-6 gap-3">
                <Button
                  variant="ghost"
                  className="flex-1 hover:bg-gray-100"
                  onClick={() => setModalOpen(false)}
                >
                  キャンセル
                </Button>
                <Button
                  className="flex-1 bg-blue-500 text-white hover:bg-blue-600"
                  onClick={handleAddStore}
                >
                  追加
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <SuccessDialogExample
        title="✅ 作成完了！"
        message={message}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        onConfirm={()=>window.location.reload()}
      />
    </>
  );
};

export default MakeNewStoreModal;

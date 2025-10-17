// src/components/InfoBanner.tsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function InfoBanner() {
  const location = useLocation();
  const navigate = useNavigate();
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [infoType, setInfoType] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const info = params.get("info");

    if (info) {
      setInfoMessage(info);

      // 成功/失敗の種類を判定
      if (info.includes("成功") || info.includes("ログイン") || info.includes("新規登録") || info.includes("作成しました") || info.includes("送信")) {
        setInfoType("success");
      } else {
        setInfoType("error");
      }
      // URL から info を削除（リロードで残らないように）
      params.delete("info");
      navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
    }
  }, [location, navigate]);

  if (!infoMessage) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-md z-50 flex items-center gap-3 min-w-[250px]
          ${infoType === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        <span className="flex-1">{infoMessage}</span>
        <button
          onClick={() => setInfoMessage(null)}
          className="p-1 rounded hover:bg-black/10 transition"
        >
          <X size={18} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

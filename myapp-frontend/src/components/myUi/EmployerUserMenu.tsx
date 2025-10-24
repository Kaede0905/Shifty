// UserMenu.tsx
import { AnimatePresence, motion } from "framer-motion";
import { User, Settings, LogOut } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

interface UserMenuProps {
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EmployerUserMenu: React.FC<UserMenuProps> = ({ menuOpen, setMenuOpen }) => {
  const navigate = useNavigate();
  return (
    <AnimatePresence>
      {menuOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
            onClick={() => setMenuOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-40 p-6 flex flex-col"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>
            <div className="flex flex-col gap-3 mt-6">
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-black">
                <User className="h-4 w-4" /> プロフィール
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-black">
                <Settings className="h-4 w-4" /> 設定
              </button>
              <button 
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-red-600"
                onClick={()=> navigate("/")}
              >
                <LogOut className="h-4 w-4"/> ログアウト
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

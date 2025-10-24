// EmployerHeaderNoStore.tsx
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UsePullStoreEmployer } from "../fetch/UsePullStoreEmployer";

type Props = {
  setUserMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EmployerHeaderNoStore = ({setUserMenuOpen}:Props) => {
  const { user } = UsePullStoreEmployer();
  const navigate = useNavigate();
  return (
    <header
      className="flex items-center justify-between px-4 sm:px-6 py-3 
                 bg-gradient-to-b from-gray-900 to-gray-800 text-white sticky top-0 z-20"
      style={{ boxShadow: "0 5px 10px rgba(0, 0, 0, 0.4)" }}
    >
      {/* 左側：メニューアイコン & 名前 */}
      <div className="flex items-center gap-3">
        <motion.button
          className="focus:outline-none"
          onClick={()=>setUserMenuOpen(true)}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <img
            src={user?.image_url}
            alt="Employer Icon"
            className="w-10 h-10 rounded-full shadow-md"
          />
        </motion.button>

        <h1
          className="text-md sm:text-2xl font-extrabold tracking-wide px-4 py-2 rounded-lg shadow-md 
                     bg-gradient-to-r from-gray-900 to-green-600 text-white
                     hover:bg-none hover:bg-white hover:text-black transition-all duration-300 
                     transform hover:scale-105 cursor-pointer"
          onClick={() => navigate("/home/employer")}
        >
          {user?.name}の管理画面
        </h1>
      </div>

      {/* 右側：通知のみ */}
      <div className="flex items-center gap-3">
        <motion.button
          className="rounded-full text-white shadow-lg p-3 bg-gradient-to-tr from-yellow-500 via-yellow-600 to-amber-500"
          whileHover={{ scale: 1.12, rotate: 8 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/employer/notifications")}
        >
          <Bell className="h-5 w-5" />
        </motion.button>
      </div>
    </header>
  );
};

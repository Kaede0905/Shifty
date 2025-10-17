// UserHeader.tsx
import { MessageCircle } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface UserHeaderProps {
  userData: { name: string; image_url: string };
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserHeader: React.FC<UserHeaderProps> = ({ userData, setMenuOpen }) => {
  const navigate = useNavigate();
  return (
    <header
      className="flex items-center justify-between px-4 sm:px-6 py-3 bg-gradient-to-b from-black to-gray-900 text-white sticky top-0 z-20"
      style={{ boxShadow: "0 5px 10px rgba(0, 0, 0, 0.368)" }}
    >
      <div className="flex items-center gap-3">
        <motion.button
          onClick={() => setMenuOpen(true)}
          className="focus:outline-none"
          whileHover={{ scale: 1.1, rotate: 5 }} // ホバー時に拡大・回転
          whileTap={{ scale: 0.95 }} // クリック時の縮小
        >
          <img
            src={userData.image_url}
            alt="User Icon"
            className="w-10 h-10 rounded-full shadow-md"
          />
        </motion.button>
        <h1
          className="text-md sm:text-2xl font-extrabold tracking-wide text-center sm:text-left px-4 py-2 
                    rounded-lg shadow-md bg-gradient-to-r from-gray-900 to-sky-600 text-white
                    hover:bg-none hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105 cursor-pointer"
          onClick={() => navigate("/home/employee")}
        >
          {userData.name}のホーム
        </h1>


      </div>
      <motion.button
        className="rounded-full text-white shadow-lg p-3 bg-gradient-to-tr from-blue-500 via-blue-600 to-sky-500"
        whileHover={{ scale: 1.12, rotate: 8 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="h-5 w-5" />
      </motion.button>
    </header>
  );
};

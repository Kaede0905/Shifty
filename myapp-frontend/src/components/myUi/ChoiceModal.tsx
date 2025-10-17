import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface SignUpOption {
  label: string;   // ボタンに表示するラベル (例: "📧 メールで登録")
  href: string;    // リンク先
  className: string; // ボタンの色・スタイル
}

interface EmployeeSignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: SignUpOption[];
  title?: string;     // モーダルタイトル
  description?: string; // モーダルの説明文
}

export default function EmployeeSignUpModal({
  isOpen,
  onClose,
  options,
  title = "社員用新規登録",
  description = "登録方法を選択してください",
}: EmployeeSignUpModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 text-center"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              {title}
            </h2>
            <p className="text-gray-500 mb-6">{description}</p>

            {options.map((opt, idx) => (
              <a
                key={idx}
                href={opt.href}
                className={`flex items-center justify-center gap-3 font-medium py-3 px-6 rounded-xl mb-4 transition-transform transform hover:-translate-y-1 hover:scale-105 ${opt.className}`}
              >
                {opt.label}
              </a>
            ))}

            <Button
              variant="ghost"
              className="mt-4"
              onClick={onClose}
            >
              キャンセル
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

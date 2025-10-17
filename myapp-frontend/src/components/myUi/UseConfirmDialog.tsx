import { useState } from "react";

// フックの返り値型: [表示用JSX, 関数]
export const useConfirmDialog = (): [React.ReactNode, (title: string, message: string) => Promise<boolean>] => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [resolver, setResolver] = useState<(value: boolean) => void>();

  const openDialog = (dialogTitle: string, dialogMessage: string) => {
    setTitle(dialogTitle);
    setMessage(dialogMessage);
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  };

  const handleYes = () => {
    setOpen(false);
    resolver?.(true);
  };

  const handleNo = () => {
    setOpen(false);
    resolver?.(false);
  };

  const Dialog = open ? (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-80 sm:w-96 p-6 transform scale-95 animate-fadeIn transition-all duration-300">
        {/* タイトル */}
        <h3 className="flex items-center text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
          <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-cyan-400 mr-3 rounded"></span>
          {title}
        </h3>

        {/* メッセージ */}
        <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm sm:text-base leading-relaxed">
          {message}
        </p>

        {/* ボタン */}
        <div className="flex justify-end gap-4">
          <button
            onClick={handleNo}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl shadow-inner text-gray-800 dark:text-gray-100 transition-transform duration-200 active:scale-95"
          >
            いいえ
          </button>
          <button
            onClick={handleYes}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg transform transition-transform duration-200 hover:-translate-y-1 active:scale-95"
          >
            はい
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return [Dialog, openDialog];
};

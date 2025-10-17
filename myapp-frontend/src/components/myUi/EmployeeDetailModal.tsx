import React, { useState } from "react";
import { EmployerEmployeeDetail } from "../fetch/EmployerEmployeeDetail";

interface EmployeeData {
  id: number;
  assign_id: number;
  name: string;
  image_url: string;
  salary: number;
  night_salary: number;
  role: string;
}

type EmployeeDetailModalProps = {
  open: boolean;
  onClose: () => void;
  employee: EmployeeData | null;
  refetchFlag: number;
  setRefetchFlag: React.Dispatch<React.SetStateAction<number>>;
};

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  open,
  onClose,
  employee,
  refetchFlag,
  setRefetchFlag
}) => {
  if (!open || !employee) return null;

  // 入力用の state を定義
  const [role, setRole] = useState(employee.role);
  const [salary, setSalary] = useState(employee.salary);
  const [nightSalary, setNightSalary] = useState(employee.night_salary);

  const handleSave = async () => {
    // 編集された値をまとめる
    const updated: EmployeeData = {
      ...employee,
      role,
      salary,
      night_salary: nightSalary,
    };

    await EmployerEmployeeDetail(updated,{refetchFlag,setRefetchFlag}); // API呼び出し
    onClose(); // ← () をつける
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* ヘッダー */}
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          {employee.name} の編集フォーム
        </h2>

        {/* プロフィール */}
        <div className="flex items-center gap-3 mb-6">
          <img
            src={employee.image_url || "https://placehold.co/80x80?text=User"}
            alt={employee.name}
            className="w-16 h-16 rounded-full object-cover border"
          />
          <div>
            <p className="text-gray-800 font-semibold">{employee.name}</p>
            <p className="text-sm text-gray-500">ID: {employee.id}</p>
          </div>
        </div>

        {/* フォーム */}
        <div className="space-y-4">
          <label className="block">
            <span className="font-semibold text-sm">役職</span>
            <input
              type="text"
              className="mt-1 w-full border rounded p-2 text-sm"
              value={role}
              placeholder="未設定"
              onChange={(e) => setRole(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="font-semibold text-sm">時給</span>
            <input
              type="number"
              className="mt-1 w-full border rounded p-2 text-sm"
              value={salary}
              placeholder="未設定"
              onChange={(e) => setSalary(Number(e.target.value))}
            />
          </label>

          <label className="block">
            <span className="font-semibold text-sm">深夜時給</span>
            <input
              type="number"
              className="mt-1 w-full border rounded p-2 text-sm"
              value={nightSalary}
              placeholder="未設定"
              onChange={(e) => setNightSalary(Number(e.target.value))}
            />
          </label>
        </div>

        {/* フッターボタン */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded text-sm"
          >
            キャンセル
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            onClick={handleSave}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

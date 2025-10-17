import { useState } from "react";
import type { Shift } from "../Type/Shift";
import { X } from "lucide-react";
import { EmployerShiftCD } from "../fetch/EmployerShiftCD";
import { useConfirmDialog } from "./UseConfirmDialog";
import { toast } from "sonner";

type Props = {
  shift: Shift;
  onClose: () => void;
  refetchFlag: number;
  setRefetchFlag: React.Dispatch<React.SetStateAction<number>>;
};

export const ShiftEditModal = ({ shift, onClose, refetchFlag, setRefetchFlag}: Props) => {
  const [ConfirmDialog, openConfirm] = useConfirmDialog();
  const { clickDelete, clickConfirm } = EmployerShiftCD({refetchFlag, setRefetchFlag});
  const [editedShift, setEditedShift] = useState<Shift>(shift);
  const [isProcessing, setIsProcessing] = useState(false);
  function timeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  }

  // 00:00〜23:30 の 30分刻みリスト
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hh = String(Math.floor(i / 2)).padStart(2, "0");
    const mm = i % 2 === 0 ? "00" : "30";
    return `${hh}:${mm}`;
  });

  // ステータスを日本語で表示
  const { statusText, statusClass } = (() => {
  switch (shift.status) {
    case "submit":
      return { statusText: "申請中", statusClass: "text-blue-600" };
    case "approved":
      return { statusText: "承認済み", statusClass: "text-green-600" };
    case "rejected":
      return { statusText: "却下済み", statusClass: "text-red-600" };
    default:
      return { statusText: "不明", statusClass: "text-gray-600" };
  }
  })();

  return (
    <>
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/95 p-6 rounded-lg shadow-lg w-[500px] max-w-[95%] relative">
        {/* 右上の×ボタン */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-lg rounded hover:bg-black/10 transition"
        >
          <X size={25} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">シフト詳細・編集</h2>

        <div className="mb-1">
          <span className="font-semibold">社員名: </span>
          <span>{shift.employee_account_name ?? shift.employee_account_id}</span>
        </div>
        <div className="mb-3 text-sm text-gray-600">
          <span className="font-semibold">状態: </span>
          <span className={`font-bold ${statusClass}`}>{statusText}</span>
        </div>

        {/* 開始時間 */}
        <label className="block mb-3">
          <span className="font-semibold">開始時間:</span>
          <select
            value={editedShift.start_time ?? ""}
            onChange={(e) =>
              setEditedShift({ ...editedShift, start_time: e.target.value })
            }
            className="border p-2 w-full mt-1 rounded"
          >
            <option value="">選択してください</option>
            {timeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        {/* 終了時間 */}
        <label className="block mb-3">
          <span className="font-semibold">終了時間:</span>
          <select
            value={editedShift.end_time ?? ""}
            onChange={(e) =>
              setEditedShift({ ...editedShift, end_time: e.target.value })
            }
            className="border p-2 w-full mt-1 rounded"
          >
            <option value="">選択してください</option>
            {timeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        {/* 備考 */}
        <label className="block mb-3">
          <span className="font-semibold">備考:</span>
          <textarea
            value={editedShift.note ?? ""}
            onChange={(e) =>
              setEditedShift({ ...editedShift, note: e.target.value })
            }
            className="border p-2 w-full mt-1 rounded"
            rows={3}
            placeholder="備考を入力してください"
          />
        </label>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={async() => {
              const result = await openConfirm("シフトを却下しますか？",`シフトの却下を行います。(却下したデータは残ります。)`);
              if(!result) return;
              setIsProcessing(true);
              clickDelete(editedShift);
              setIsProcessing(false);
              onClose();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            disabled={isProcessing}
          >
            削除
          </button>
          <button
            onClick={async() => {
              if(!editedShift.start_time || !editedShift.end_time){
                toast("承認失敗", {
                  description: "開始時間か終了時間が未記入です",
                  action: {
                    label: "閉じる",
                    onClick: () => {},
                  },
                });
                return
              }
              if(timeToMinutes(editedShift.start_time) >= timeToMinutes(editedShift.end_time)){
                toast("承認失敗", {
                  description: "開始時間が終了時間以降になっています",
                  action: {
                    label: "閉じる",
                    onClick: () => {},
                  },
                });
                return
              }
              if(shift.start_time != editedShift.start_time || shift.end_time != editedShift.end_time){
                const result = await openConfirm(
                  "シフトの時間を変更しますか？",
                  `${shift.start_time}~${shift.end_time}から${editedShift.start_time}~${editedShift.end_time}に変更しようとしています。続けますか？`
                );
                if(!result) return;
              }
              setIsProcessing(true);
              clickConfirm(editedShift);
              setIsProcessing(false);
              onClose();
            }}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={isProcessing}
          >
            承認
          </button>

        </div>
      </div>
    </div>
    {ConfirmDialog}
    </>
  );
};

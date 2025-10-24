import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EmployerHeaderNoStore } from "@/components/myUi/EmployerHeaderNoStore";
import { LoadingScreen } from "@/components/myUi/LoadingScreen";
import { UsePullShiftEmployer } from "@/components/fetch/UsePullShiftEmployer";
import { ShiftEditModal } from "@/components/myUi/ShiftEditModal";
import InfoBanner from "@/components/myUi/InfoBanner";

type Shift = {
  id: number;
  employee_account_id: number;
  employee_account_name?: string;
  store_connect_id: number;
  work_date: string | null;
  start_time: string | null;
  end_time: string | null;
  status: "submit" | "approved" | "rejected" | string;
  note?: string | null;
};

// 30分刻みの時間スロット生成
const generateTimeSlots = () => {
  const slots: string[] = [];
  for (let h = 0; h < 24; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
};

const timeSlots = generateTimeSlots();
const setColor = {shift: "", startAndEnd: ""}
const EmployerShiftEdit = () => {
  const { id, date } = useParams<{ id: string; date: string }>();
  const navigate = useNavigate();
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [refetchFlag, setRefetchFlag] = useState(0);

  const { shifts, loading, error } = UsePullShiftEmployer(refetchFlag, id);

  if (loading) return <LoadingScreen />;
  if (error) return <div>エラー: {error}</div>;

  // 指定日のシフトのみ
  const targetShifts = shifts.filter((s: Shift) => s.work_date === date);

  // 社員ごとにまとめる
  const employees = Array.from(
    new Map(
      targetShifts.map((s) => [
        s.employee_account_id,
        s.employee_account_name ?? String(s.employee_account_id),
      ])
    ).entries()
  );

  // 時刻を分に変換
  const toMinutes = (t: string | null) => {
    if (!t) return null;
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  return (
    <>
      <InfoBanner />
      <EmployerHeaderNoStore />

      <div className="p-6 overflow-x-auto">
        {/* 戻るボタン */}
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 underline mb-4"
        >
          ＜ 戻る
        </button>

        <h2 className="text-2xl font-bold mb-6">{date} のシフト編集</h2>

        {targetShifts.length === 0 ? (
          <p className="text-gray-500">この日のシフトはまだありません。</p>
        ) : (
          <div className="relative">
            <div className="overflow-x-auto">
              <table className="border-collapse text-xs min-w-max">
                <thead className="sticky top-0 z-0 bg-gray-100/90 backdrop-blur">
                  <tr>
                    <th className="sticky left-0 z-0 bg-gray-100/90 border px-2 py-1">
                      社員名
                    </th>
                    {timeSlots.map((t, i) => (
                      <th
                        key={i}
                        className={`border px-1 py-1 min-w-[45px] ${
                          t.endsWith(":00")
                            ? "font-bold text-gray-800"
                            : "text-gray-400"
                        }`}
                      >
                        {t}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {employees.map(([empId, empName]) => {
                    const empShifts = targetShifts.filter(
                      (s) => s.employee_account_id === empId
                    );

                    return (
                      <tr key={empId}>
                        {/* 名前列固定 */}
                        <td className="sticky left-0 z-0 border px-2 py-1 font-bold bg-gray-50/90 backdrop-blur whitespace-nowrap">
                          {empName}
                        </td>
                        {timeSlots.map((slot, i) => {
                          const slotMin = toMinutes(slot);

                          const shift = empShifts.find((s) => {
                            const start = toMinutes(s.start_time);
                            const end = toMinutes(s.end_time);
                            return (
                              start !== null &&
                              end !== null &&
                              slotMin !== null &&
                              start <= slotMin &&
                              slotMin < end
                            );
                          });
                          if(shift){
                            switch (shift.status) {
                              case "submit":
                                setColor.shift = "bg-gradient-to-b from-sky-200 to-blue-300"
                                setColor.startAndEnd = "bg-gradient-to-b from-sky-500 to-blue-600 text-white rounded shadow-md font-bold"
                                break;
                              case "approved":
                                setColor.shift = "bg-gradient-to-b from-emerald-200 to-emerald-300"
                                setColor.startAndEnd = "bg-gradient-to-b from-emerald-400 to-emerald-500 text-white rounded shadow-md font-bold"
                                break;
                              case "rejected":
                                setColor.shift = "bg-gradient-to-b from-rose-300 to-red-400"
                                setColor.startAndEnd = "bg-gradient-to-b from-rose-500 to-red-700 text-white rounded shadow-md font-bold"
                                break;
                            }
                          }
                          const startMin = shift ? toMinutes(shift.start_time) : null;
                          const endMin = shift ? toMinutes(shift.end_time) : null;
                          const endDisplayMin = endMin !== null ? endMin - 30 : null;
                          
                          const isStart = shift && startMin === slotMin;
                          const isEnd = shift && endDisplayMin === slotMin;
                          return (
                            <td
                              key={i}
                              className={`border min-w-[45px] text-center cursor-pointer
                                ${shift ? setColor.shift : ""}
                                ${isStart ? setColor.startAndEnd : ""}
                                ${isEnd ? setColor.startAndEnd : ""}
                              `}
                              onClick={() => shift && setEditingShift(shift)}
                            >
                              {isStart ? shift.start_time : ""}
                              {isEnd ? shift.end_time : ""}
                            </td>

                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {editingShift && (
        <ShiftEditModal
          shift={editingShift}
          onClose={() => setEditingShift(null)}
          refetchFlag={refetchFlag}
          setRefetchFlag={setRefetchFlag}
        />
      )}
    </>
  );
};

export default EmployerShiftEdit;

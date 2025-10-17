import { useState,useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { SuccessDialogExample } from "./SuccessDialogExample";
import { PullShiftsEmployee } from "../fetch/PullShiftEmployee";
import { LoadingScreen } from "./LoadingScreen";

interface Shift {
  day: string;
  time: string[] | null; // 複数シフトに対応
  confirmed: boolean;
}
type WeekShiftProps = {
  storeId: number;
  sundayDate: string;
  saturdayDate: string;
};

const WeekShift: React.FC<WeekShiftProps> = ({
  storeId,
  sundayDate,
  saturdayDate,
}) => {

// const WeekShift = (storeId: number, year: number, month: number, sundayDate: string, saturdaydate: string) => {

  const [currentSunday, setCurrentSunday] = useState(sundayDate);
  const [currentSaturday, setCurrentSaturday] = useState(saturdayDate);
  const sampleShifts: Shift[] = [
    { day: "日", time: ["13:00 - 19:00"], confirmed: true },
    { day: "月", time: ["9:00 - 12:00", "14:00 - 17:00"], confirmed: true },
    { day: "火", time: ["10:00 - 18:00"], confirmed: false },
    { day: "水", time: null, confirmed: false },
    { day: "木", time: ["12:00 - 14:00", "15:00 - 20:00"], confirmed: true },
    { day: "金", time: ["9:00 - 15:00"], confirmed: false },
    { day: "土", time: null, confirmed: false },
  ];
  const [weekOffset, setWeekOffset] = useState(0);
  const [prevOffset, setPrevOffset] = useState(0);
  useEffect(() => {
    const startOfWeek = dayjs().startOf("week").add(weekOffset, "week");
    const endOfWeek = startOfWeek.add(6, "day");
    setCurrentSunday(startOfWeek.format("YYYY-MM-DD"));   // ← 日付文字列
    setCurrentSaturday(endOfWeek.format("YYYY-MM-DD"));
  }, [weekOffset]);
  
  const startOfWeek = dayjs().startOf("week").add(weekOffset, "week");
  const endOfWeek = startOfWeek.add(6, "day");
  const datestart = startOfWeek.date();
  const { shifts, setShifts, loading, error } = PullShiftsEmployee(storeId, currentSunday, currentSaturday);
    if (loading) return <LoadingScreen />;
    if (error) return <div>エラー: {error}</div>;
  
  const days = Array.from({ length: 7 }).map((_, i) => {
    const date = startOfWeek.add(i, "day");
    return {
      label: ["日", "月", "火", "水", "木", "金", "土"][date.day()],
      date: date.format("MM/DD"),
      ...shifts[i],
    };
  });
  
  const changeWeek = (delta: number) => {
    setPrevOffset(weekOffset);
    setWeekOffset(weekOffset + delta);
  };

  const slideDirection = weekOffset > prevOffset ? 100 : -100;

  return (
    <div className="bg-white rounded-xl shadow p-4 w-full">
      <div className="flex flex-col items-center mb-3">
        <div className="flex justify-between items-center w-full">
          <button
            className="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
            onClick={() => changeWeek(-1)}
          >
            ← 前週
          </button>
          <h2 className="text-lg font-semibold">
            {weekOffset === 0
              ? "今週"
              : `${Math.abs(weekOffset)}週${weekOffset > 0 ? "後" : "前"}`}
          </h2>
          <button
            className="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
            onClick={() => changeWeek(1)}
          >
            次週 →
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {startOfWeek.format("M/D")} ~ {endOfWeek.format("M/D")}
        </p>
      </div>

      <div className="overflow-x-auto">
        <AnimatePresence mode="wait" custom={slideDirection}>
          <motion.div
            key={weekOffset}
            initial={{ opacity: 0, x: slideDirection }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -slideDirection }}
            transition={{ duration: 0.3 }}
            className="inline-grid grid-cols-7 gap-2 min-w-[700px] sm:min-w-0"
          >
            {days.map((s, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg text-center min-h-[90px] flex flex-col justify-center whitespace-nowrap gap-1 ${
                  s.time && s.time.length > 0
                    ? s.confirmed
                      ? "bg-blue-500 text-white"
                      : "bg-blue-100 text-blue-700"
                    : "bg-gray-50 text-gray-400"
                }`}
              >
                <p className="text-xs mb-1">{s.label}</p>
                <p className="font-semibold">{s.date}</p>
                {s.time && s.time.length > 0 ? (
                  <div className="flex justify-center flex-wrap gap-1">
                    {s.time.map((t, idx) => (
                      <span key={idx} className="text-sm">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm">シフトなし</p>
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WeekShift;

import { useState } from "react";
import dayjs from "dayjs";
import { usePullMonthShifts } from "@/components/fetch/usePullMonthShifts";
import { useNavigate } from "react-router-dom";
import { LoadingScreen } from "@/components/myUi/LoadingScreen";

interface MonthCalendarProps {
  storeId: number;
  storeName: string;
  year: number;
  month: number;
}

export const MonthCalendar: React.FC<MonthCalendarProps> = ({
  storeId,
  storeName,
  year: initialYear,
  month: initialMonth,
}) => {
  const navigate = useNavigate();
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const startOfMonth = dayjs(`${year}-${month}-01`);
  const endOfMonth = startOfMonth.endOf("month");
  const startDisplay = startOfMonth.startOf("week");
  const endDisplay = endOfMonth.endOf("week");
  const totalDays = endDisplay.diff(startDisplay, "day") + 1;
  const daysArray = Array.from({ length: totalDays }, (_, i) =>
    startDisplay.add(i, "day")
  );
  const { shiftsInfo, loading, error } = usePullMonthShifts(
    storeId,
    startOfMonth.format("YYYY-MM-DD"),
    endOfMonth.format("YYYY-MM-DD")
  );
      
  const handlePrevMonth = () => {
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
    } else {
      setMonth((m) => m - 1);
    }
  };
  
  const handleNextMonth = () => {
    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
    } else {
      setMonth((m) => m + 1);
    }
  };
  if (loading) return <LoadingScreen />
  if (error) return <p>エラー: {error}</p>;
  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-black via-gray-800 to-gray-900 text-white px-4 py-4 shadow-xl">
        {/* PC: 横並び / スマホ: 縦並び */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between relative">
          
          {/* 店名 */}
          <h1 
            className="text-lg sm:text-2xl font-extrabold tracking-wide text-center sm:text-left px-3 py-1 border border-white
                       hover:bg-white hover:text-black transition-colors duration-200 shadow-sm rounded"
            onClick={()=> navigate(`/store/${storeId}`)}
          >
            {storeName}
          </h1>
          {/* 中央：年月 + 前後ボタン */}
          <div className="mt-3 sm:mt-0 sm:absolute sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="px-3 py-1 border border-white text-white rounded-md 
                          hover:bg-white hover:text-black transition-colors duration-200 shadow-sm"
              >
                前月
              </button>
              <span className="text-sm sm:text-lg font-semibold tracking-wide">
                {year}年 {month}月
              </span>
              <button
                onClick={handleNextMonth}
                className="px-3 py-1 border border-white text-white rounded-md 
                          hover:bg-white hover:text-black transition-colors duration-200 shadow-sm"
              >
                次月
              </button>
            </div>
          </div>

          {/* 丸アイコン */}
          <div className="flex items-center gap-3 mt-3 sm:mt-0 sm:ml-auto justify-center sm:justify-end">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full"></span>
              <span className="text-xs sm:text-sm">保存済み</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-gradient-to-r from-sky-600 to-blue-700 rounded-full"></span>
              <span className="text-xs sm:text-sm">送信済み</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full border border-white"></span>
              <span className="text-xs sm:text-sm">確定済み</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-gradient-to-r from-rose-500 to-red-700 rounded-full border border-white"></span>
              <span className="text-xs sm:text-sm">却下済み</span>
            </div>
          </div>
        </div>
      </header>
    <div className="flex flex-col min-h-screen">
      {/* ヘッダー */}
      {/* カレンダー */}
      <main className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-7 gap-2 sm:gap-4">
        {/* 曜日 */}
        {["日", "月", "火", "水", "木", "金", "土"].map((d, idx) => (
          <div
            key={d}
            className={`font-bold text-center py-1 sm:py-2 ${
              idx === 0 ? "text-red-500" : idx === 6 ? "text-blue-500" : "text-gray-700"
            }`}
          >
            {d}
          </div>
          ))}

          {/* 日付 */}
          {daysArray.map((date) => {
            const key = date.format("YYYY-MM-DD");
            const shifts = shiftsInfo[key] || [];

            return (
              <div
                key={key}
                className="min-h-[100px] sm:min-h-[120px] border rounded p-1 sm:p-2 bg-gray-50 flex flex-col overflow-y-auto"
                style={{ maxHeight: "120px" }}
              >
                <div className="text-xs sm:text-sm font-bold mb-1">
                  {date.date()}
                </div>
                <div className="flex flex-col gap-1 overflow-y-auto">
                  {shifts.length > 0 ? (
                    shifts.map((shift, idx) => (
                      <div
                        key={idx}
                        className={`p-1 sm:p-2 border rounded shadow-sm text-xs sm:text-sm text-white rounded-md shadow ${
                          shift.status === "saved"
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-700"
                            : shift.status === "submit"
                            ? "bg-gradient-to-r from-sky-600 to-blue-700"
                            : shift.status === "rejected"
                            ? "bg-gradient-to-r from-rose-500 to-red-700"
                            : "bg-gradient-to-r from-gray-700 to-gray-900"
                        }`}
                      >
                        {shift.time}
                      </div>
                    ))
                  ) : (
                    <div className="text-[10px] text-gray-400">シフトなし</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
    </>
  );
};

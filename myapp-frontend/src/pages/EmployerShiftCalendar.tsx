import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { EmployerHeaderNoStore } from "@/components/myUi/EmployerHeaderNoStore"
import { useParams } from "react-router-dom";
import { EmployerUserMenu } from "@/components/myUi/EmployerUserMenu";

const EmployerShiftCalendar = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [menuUserMenuOpen, setUserMenuOpen] = useState(false);

  // 月の日付リストを生成
  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");
  const startDate = startOfMonth.startOf("week"); // カレンダーは週単位で開始
  const endDate = endOfMonth.endOf("week");

  const days: dayjs.Dayjs[] = [];
  let day = startDate;
  while (day.isBefore(endDate) || day.isSame(endDate, "day")) {
    days.push(day);
    day = day.add(1, "day");
  }

  return (
    <>
      <EmployerHeaderNoStore 
        setUserMenuOpen={setUserMenuOpen}
      />
      <EmployerUserMenu 
        menuOpen={menuUserMenuOpen}
        setMenuOpen={setUserMenuOpen}
      />
      <div className="p-6">
        {/* 月切り替え */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
            className="px-2 py-1 bg-gray-200 rounded"
          >
            ← 前月
          </button>
          <h2 className="text-xl font-bold">
            {currentMonth.format("YYYY年 M月")}
          </h2>
          <button
            onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}
            className="px-2 py-1 bg-gray-200 rounded"
          >
            次月 →
          </button>
        </div>

        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center font-bold">
          {["日", "月", "火", "水", "木", "金", "土"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* 日付マス */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((d) => {
            const isCurrentMonth = d.month() === currentMonth.month();
            return (
              <div
                key={d.toString()}
                onClick={() => navigate(`/store/${id}/shifts/${d.format("YYYY-MM-DD")}`)}
                className={`border h-20 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100 rounded
                ${isCurrentMonth ? "" : "text-gray-400"}
                ${d.day() === 0 ? "text-red-500" : ""}
                ${d.day() === 6 ? "text-blue-500" : ""}
                `}
              >
                {d.date()}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default EmployerShiftCalendar;

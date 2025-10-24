import { useState } from "react";
import dayjs from "dayjs";
import { LoadingScreen } from "@/components/myUi/LoadingScreen";
import { UsePullShiftEmployer } from "@/components/fetch/UsePullShiftEmployer";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { UsePullstoreEmployee } from "@/components/fetch/UsePullStoreEmployee";
import { EmployerHeaderNoStore } from "@/components/myUi/EmployerHeaderNoStore";
import { EmployerUserMenu } from "@/components/myUi/EmployerUserMenu";

const EmployeeShiftSituation = () => {
  const { id } = useParams<{ id: string }>();
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [menuUserMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const currentMonth = currentDate.month() + 1;
  const currentYear = currentDate.year();
  const StoreId = Number(id);

  const { users, loading: loadingUser, error: errorUser } = UsePullstoreEmployee(StoreId);
  const { shifts, loading: loadingShift, error: errorShift } = UsePullShiftEmployer(StoreId, id);

  if (loadingUser || loadingShift) return <LoadingScreen />;
  if (errorUser || errorShift)
    return <div className="p-4 text-red-500">エラーが発生しました。</div>;

  const daysInMonth = Array.from(
    { length: currentDate.daysInMonth() },
    (_, i) =>
      dayjs(`${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`)
  );

  const monthShifts = shifts.filter(
    (s) => s.work_date && dayjs(s.work_date).month() + 1 === currentMonth
  );

  const hasShift = (empId: number, date: string) => {
    const shift = monthShifts.find(
      (s) => s.employee_account_id === empId && s.work_date === date
    );
    return shift && shift.status !== "rejected";
  };

  const handlePrevMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
  const handleNextMonth = () => setCurrentDate(currentDate.add(1, "month"));
  const handleCellClick = (date: string) => {
    navigate(`/store/${StoreId}/shifts/${date}`);
  };

  return (
    <>
    <EmployerHeaderNoStore 
      setUserMenuOpen={setUserMenuOpen}
    />
    <EmployerUserMenu 
      menuOpen={menuUserMenuOpen}
      setMenuOpen={setUserMenuOpen}
    />
    <div className="p-4 overflow-x-auto">
      {/* ==== 月切り替えヘッダー ==== */}
      <div className="flex justify-center items-center gap-4 mb-4 sticky top-0 bg-white z-20 py-2">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-200 rounded-full"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold">
          {currentYear}年 {currentMonth}月
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-200 rounded-full"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* ==== 表 ==== */}
      <div className="overflow-auto max-h-[80vh] border border-gray-300 rounded-md">
        <table className="min-w-max border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-gray-100">
            <tr>
              <th
                className="border border-gray-300 p-2 w-40 text-center bg-gray-100 sticky left-0 z-20"
              >
                従業員
              </th>
              {daysInMonth.map((d) => (
                <th
                  key={d.format("YYYY-MM-DD")}
                  onClick={() => handleCellClick(d.format("YYYY-MM-DD"))}
                  className="border border-gray-300 p-2 text-center min-w-[50px] cursor-pointer hover:bg-gray-200 transition"
                >
                  <div>{d.format("D")}</div>
                  <div className="text-xs text-gray-500">
                    {["日", "月", "火", "水", "木", "金", "土"][d.day()]}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                {/* 従業員セル（左固定） */}
                <td className="border border-gray-300 p-2 text-left bg-white sticky left-0 z-10">
                  <div className="flex items-center gap-2">
                    {user.image_url && (
                      <img
                        src={user.image_url}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <span className="font-medium">{user.name}</span>
                  </div>
                </td>

                {/* 各日付セル */}
                {daysInMonth.map((d) => (
                  <td
                    key={`${user.id}-${d.format("YYYY-MM-DD")}`}
                    onClick={() => handleCellClick(d.format("YYYY-MM-DD"))}
                    className="border border-gray-300 text-center p-1 cursor-pointer hover:bg-gray-100 transition"
                  >
                    {hasShift(user.id, d.format("YYYY-MM-DD")) ? (
                      <span className="text-green-600 font-bold">○</span>
                    ) : (
                      ""
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ==== データなし時 ==== */}
      {users.length === 0 && (
        <div className="text-gray-500 text-center mt-4">
          従業員データがありません。
        </div>
      )}
    </div>
    </>
  );
};

export default EmployeeShiftSituation;

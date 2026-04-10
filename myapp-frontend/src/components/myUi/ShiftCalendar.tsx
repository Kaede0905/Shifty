import { useState } from "react";
import { SuccessDialogExample } from "./SuccessDialogExample";
import { TFDialog } from "./TFDialog";
import { useConfirmDialog } from "./UseConfirmDialog";
import { UsePullShiftsEmployee } from "../fetch/UsePullShiftsEmployee";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { LoadingScreen } from "./LoadingScreen";

type Store = { id: number; name: string; store_type: string };
type Props = { store: Store };

const HOURS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? 0 : 30;
  return { h, m };
});

const TABS: Record<string, [number, number]> = {
  morning: [0, 9],
  day: [9, 16],
  night: [16, 24],
};

type Cell = { h: number; m: number };
type Range = { start: Cell; end: Cell; type: "unsaved" | "saved" | "submit" | "approved" | "rejected"};

const getWeekday = (year: number, month: number, day: number) => {
  const d = new Date(year, month - 1, day);
  return ["日", "月", "火", "水", "木", "金", "土"][d.getDay()];
};

const isHoliday = (year: number, month: number, day: number) => {
  const weekday = getWeekday(year, month, day);
  if (weekday === "日") return true;
  const holidays = ["10/13"];
  if (holidays.includes(`${month}/${day}`)) return true;
  return false;
};

export default function ShiftCalendar({ store }: Props) {
  const navigation = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [openSuccessDialog, setSuccessDialog] = useState(false);
  const [ConfirmDialog, openConfirm] = useConfirmDialog();
  const [targetShift, setTargetShift] = useState<{ date: string; range: Range } | null>(null);
  const [deleteTitle, setdeleteTitle] = useState("");
  const [deleteMessage, setdeleteMessage] = useState("");
  const [openSavedDeleteDialog, setSavedDeleteDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] =useState("");
  const API_URL = import.meta.env.VITE_API_URL;
  const [tab, setTab] = useState<"morning" | "day" | "night">("morning");
  const [selectStart, setSelectStart] = useState<{ date: string; cell: Cell } | null>(null);
  const [selectEnd, setSelectEnd] = useState<{ date: string; cell: Cell } | null>(null);
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // getMonth() は 0〜11 を返すので +1
  const { shifts, setShifts, loading, error } = UsePullShiftsEmployee(store.id, year, month);
  if (loading) return <LoadingScreen />;
  if (error) return <div>エラー: {error}</div>;
  const [startHour, endHour] = TABS[tab];

  const handleHomeBotton = async() => {
    const result = await openConfirm("ページを離れますか？","現在保存されていないデータは削除されます。");
    if (!result) return;
    navigation(`/store/${store.id}`)
  }

  const handleDelete = () => {
  if (!targetShift) return;
    const { date, range } = targetShift;
    setShifts((prev) => ({
      ...prev,
      [date]: prev[date].filter((x) => x !== range),
    }));
    setTargetShift(null);
  };
  const filteredHours = HOURS.filter(({ h }) => h >= startHour && h < endHour);

  const daysInMonth = new Date(year, month, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getIndex = (cell: Cell) =>
    HOURS.findIndex((c) => c.h === cell.h && c.m === cell.m);

  const formatTime = (cell: Cell) => {
    const hh = String(cell.h).padStart(2, "0");
    const mm = cell.m === 0 ? "00" : "30";
    return `${hh}:${mm}`;
  };

  const formatEndTime = (cell: Cell) => {
    let hour = cell.h;
    let minute = cell.m;
    if (minute === 0) {
      minute = 30;
    } else {
      minute = 0;
      hour += 1;
    }
    const hh = String(hour).padStart(2, "0");
    const mm = String(minute).padStart(2, "0");
    return `${hh}:${mm}`;
  };

  const handleCellClick = (date: string, cell: Cell) => {
    const ranges = shifts[date] || [];
    const idx = getIndex(cell);

    // 既存の範囲クリック時 → 削除可能か判定
    for (const r of ranges) {
      const from = getIndex(r.start);
      const to = getIndex(r.end);
      const [s, e] = from <= to ? [from, to] : [to, from];

      if (idx >= s && idx <= e) {
        // type="submit" は削除不可
        if (r.type === "submit" || r.type === "approved"){
          setTitle("編集できません")
          setMessage("既にこの時間のシフトは送信済みのため、編集することができません")
          setOpenDialog(true);
          return;
        } 
        if (r.type === "rejected"){
          setTitle("編集できません")
          setMessage("既にこの時間のシフトは削除済みのため、編集することができません")
          setOpenDialog(true);
          return;
        } 
        if (r.type === "saved"){
          setdeleteTitle("警告！")
          setdeleteMessage("保存された項目を消去しようとしています。本当に消去しますか？")
          setTargetShift({ date, range: r });
          setSavedDeleteDialog(true);
          return;
        } 
        setShifts((prev) => ({
          ...prev,
          [date]: prev[date].filter((x) => x !== r),
        }));
        return;
      }
    }

    // 開始が未選択 → 開始をセット
    if (!selectStart || selectStart.date !== date) {
      setSelectStart({ date, cell });
      setSelectEnd(null);
      return;
    }

    // 終了を選択したら範囲確定
    setSelectEnd({ date, cell });
    const newRange: Range = { 
      start: selectStart.cell, 
      end: cell, 
      type: "unsaved",
    };
    setShifts((prev) => ({
      ...prev,
      [date]: [...(prev[date] || []), newRange],
    }));

    setSelectStart(null);
    setSelectEnd(null);
  };

  const getCellColor = (date: string, cell: Cell, bg: string) => {
    const ranges = shifts[date] || [];
    const idx = getIndex(cell);

    for (const r of ranges) {
      const from = getIndex(r.start);
      const to = getIndex(r.end);
      const [s, e] = from <= to ? [from, to] : [to, from];

      if (idx >= s && idx <= e) {
        if (r.type === "submit" || r.type === "approved"){
          return idx === s || idx === e ? "bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded shadow-md" : "bg-gradient-to-r from-gray-500 to-gray-600" ; // 提出済み
        } 
        if (r.type === "rejected"){
          return idx === s || idx === e ? "bg-gradient-to-r from-rose-500 to-red-700 text-white rounded shadow-md" : "bg-gradient-to-r from-rose-300 to-red-400 text-white" ; // 提出済み
        } 
        if (r.type === "saved"){
          return idx === s || idx === e ? "bg-gradient-to-r from-emerald-400 to-emerald-600 text-white rounded shadow-md" : "bg-gradient-to-r from-emerald-200 to-emerald-300" ; // 保存済み
        }  
        return idx === s || idx === e ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded shadow-md" : "bg-gradient-to-r from-sky-200 to-blue-300"; // 新規範囲
      }
    }

    if (selectStart?.date === date && getIndex(selectStart.cell) === idx) {
      return "bg-gradient-to-r from-sky-600 to-blue-700 text-white rounded-md shadow";
    }
    if (selectEnd?.date === date && getIndex(selectEnd.cell) === idx) {
      return "bg-sky-500 text-white rounded-full shadow";
    }
    return bg;
  };

  const getCellDisplay = (date: string, cell: Cell) => {
    const ranges = shifts[date] || [];
    const idx = getIndex(cell);

    for (const r of ranges) {
      const from = getIndex(r.start);
      const to = getIndex(r.end);
      const [s, e] = from <= to ? [from, to] : [to, from];

      if (idx === s) return `${formatTime(from <= to ? r.start : r.end)}~`;
      if (idx === e) return `~${formatEndTime(from <= to ? r.end : r.start)}`;
    }

    // 開始位置を選択中のときはそのセルに時間を出す
    if (selectStart?.date === date && getIndex(selectStart.cell) === idx) {
      return `${formatTime(selectStart.cell)}~`;
    }

    // 選択中の終了
    if (selectEnd?.date === date && getIndex(selectEnd.cell) === idx) {
      return `~${selectEnd.cell}`;
    }

    return "";
  };

  const totalHours = Object.values(shifts)
    .flat()
    .reduce((sum, r) => {
      const s = getIndex(r.start);
      const e = getIndex(r.end);
      return sum + (Math.abs(e - s) + 1) * 0.5;
    }, 0);
  const totalWage = totalHours * 1000;

  const handleSave = async() => {
    const result = await openConfirm("保存しますか？",`${year}年${month}月のデータのみ保存します。`);
    if (!result) return;
    try{
      const res = await fetch(`${API_URL}/api/v1/shift`, { 
        method: "POST", 
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          store_id: store.id,
          year: year,
          month: month,
          shifts: shifts
        })
      })
      const data = await res.json();
      if(res.ok){
        setSuccessMessage(data.message);
        setSuccessDialog(true);
      }else if(data.errors){
        toast("保存失敗", {
          description: data.errors,
          action: {
            label: "閉じる",
            onClick: () => console.log("Undo"),
           },
        });
      }
    }catch(error){
      toast("通信エラー", { description: "サーバーに接続できませんでした" });
    }
  };

  const handleSubmit = async() => {
    if(store.store_type != "with_id"){
      setTitle("送信できません")
      setMessage("店舗との認証が完了していないため。送信先の店舗がありません。店舗との認証を行ってください。")
      setOpenDialog(true);
      return
    }
    const result = await openConfirm("データの保存をしましたか？",`保存された${year}年${month}月のデータを送信します`);
    if (!result) return;
    const reresult = await openConfirm("本当にデータの送信を行いますか？","データ送信後の変更は出来ません");
    if (!reresult) return;
    try{
      const res = await fetch(`${API_URL}/api/v1/shift/submit`,{
        method: "POST", 
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          store_id: store.id,
          year: year,
          month: month,
        })
      })
      const data = await res.json();
      if (res.ok){
        navigation(`/store/${store.id}?info=${year}年${month}月のシフトの送信に成功しました`);
      }else if(data.errors){
        toast("保存失敗", {
          description: data.errors,
          action: {
            label: "閉じる",
            onClick: () => console.log("Undo"),
           },
        });
      }
    }catch(error){
      toast("通信エラー", { description: "サーバーに接続できませんでした" });
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans">
      {/* ヘッダー */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-black border-b p-4 shadow-lg text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="font-extrabold text-xl sm:text-2xl tracking-wide flex items-center gap-2 justify-between">
          <span 
            className="
              px-4 py-2
              bg-gradient-to-r from-sky-600 to-cyan-500
              text-white font-semibold
              rounded-lg
              shadow-md
              border border-white/10
              transition-all duration-300
              hover:scale-105 hover:shadow-lg"
            onClick={handleHomeBotton}
          >
            {store.name}
          </span>
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
          {/* 月切替 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                month === 1 ? (setYear(year - 1), setMonth(12)) : setMonth(month - 1)
              }
              className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded-md shadow"
            >
              ◀
            </button>
            <span className="font-semibold">{year}年{month}月</span>
            <button
              onClick={() =>
                month === 12 ? (setYear(year + 1), setMonth(1)) : setMonth(month + 1)
              }
              className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded-md shadow"
            >
              ▶
            </button>
          </div>

          {/* 朝昼夜タブ */}
          <div className="flex gap-2 sm:gap-3 overflow-x-auto sm:overflow-visible">
            {[
              { key: "morning", label: "🌅 朝", time: "0:00 ~ 9:00" },
              { key: "day", label: "🌞 昼", time: "9:00 ~ 16:00" },
              { key: "night", label: "🌙 夜", time: "16:00 ~ 24:00" },
            ].map(({ key, label, time }) => (
              <button
                key={key}
                className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium transition-all duration-300 flex flex-col items-center min-w-[80px]
                            ${tab === key ? "bg-blue-600 text-white shadow-md scale-105" : "bg-gray-700 text-gray-200 hover:bg-gray-600"}`}
                onClick={() => setTab(key as "morning" | "day" | "night")}
              >
                <span>{label}</span>
                <span className="text-[10px] sm:text-xs opacity-80">{time}</span>
              </button>
            ))}
          </div>

          {/* 保存・送信ボタン */}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={handleSave}
              className="
                px-3 py-2
                bg-gradient-to-r from-emerald-500 to-emerald-600
                hover:from-emerald-600 hover:to-emerald-700
                rounded-xl shadow-md hover:shadow-lg
                font-semibold text-white
                transform hover:-translate-y-0.5
                transition-all duration-300 ease-in-out
              "
            >
              保存
            </button>
            <button
              onClick={handleSubmit}
              className="
                relative px-3 py-2 
                bg-gradient-to-r from-sky-400 to-blue-500
                rounded-lg shadow-md font-semibold text-white
                overflow-hidden
                transition-all duration-300 ease-in-out
                after:content-[''] after:absolute after:inset-0 
                after:bg-black/0 hover:after:bg-black/20 
                after:transition
              "
            >
              送信
            </button>
          </div>
        </div>
      </div>

      {/* テーブル */}
      <div className="flex-1 overflow-auto mt-2">
        <div className="overflow-x-auto">
          <table className="border-collapse text-xs sm:text-sm min-w-max">
            <thead>
              <tr>
                <th className="w-14 sm:w-16 border bg-white sticky top-0 left-0 z-30">時間</th>
                {days.map((day) => {
                  const weekday = getWeekday(year, month, day);
                  const isHolidayCell = isHoliday(year, month, day);
                  const isSaturday = weekday === "土";
                  const bg = isHolidayCell
                    ? "bg-red-200"
                    : isSaturday
                    ? "bg-blue-100"
                    : "bg-white";
                  return (
                    <th
                      key={day}
                      className={`border border-b-2 border-gray-200 px-2 sm:px-3 py-1 sm:py-2 text-center min-w-[45px] sm:min-w-[60px] sticky top-0 z-20 font-semibold ${bg}`}
                    >
                      <div className="text-[10px] sm:text-xs">{weekday}</div>
                      <div className="text-xs sm:text-sm">{month}/{day}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {filteredHours.map(({ h, m }, idx) => (
                <tr key={idx}>
                  <td
                    className="
                      border text-center sticky left-0 z-10 
                      font-mono font-bold
                      text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl
                      text-gray-900 bg-gray-200
                      tracking-wide leading-tight
                    "
                  >
                    {`${String(h).padStart(2, "0")}:${m === 0 ? "00" : "30"}`}
                  </td>
                  {days.map((day) => {
                    const weekday = getWeekday(year, month, day);
                    const isHolidayCell = isHoliday(year, month, day);
                    const isSaturday = weekday === "土";
                    const bg = isHolidayCell
                    ? "bg-red-100"
                    : isSaturday
                    ? "bg-blue-50"
                    : "bg-white";
                    const cellKey = `${year}/${month}/${day}`;
                    const bgClass = getCellColor(cellKey, { h, m } , bg);
                    return (
                      <td
                        key={day}
                        className={`border h-8 sm:h-10 cursor-pointer transition-colors text-center align-middle ${bgClass}`}
                        onClick={() => handleCellClick(cellKey, { h, m })}
                      >
                        <span className="text-[10px] sm:text-xs font-bold">
                          {getCellDisplay(cellKey, { h, m })}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TFDialog
          title={deleteTitle}
          message={deleteMessage}
          openDialog={openSavedDeleteDialog}
          setOpenDialog={setSavedDeleteDialog}
          onConfirm={handleDelete}
        />
        <SuccessDialogExample
          title={title}
          message={message}
          setOpenDialog={setOpenDialog}
          openDialog={openDialog}
          onConfirm={() => {}}
        />
        <SuccessDialogExample
          title="✅ 作成完了！"
          message={successMessage}
          openDialog={openSuccessDialog}
          setOpenDialog={setSuccessDialog}
          onConfirm={()=>window.location.reload()}
        />
        {ConfirmDialog}
      </div>

      {/* フッター */}
      <div className="p-2 sm:p-3 border-t bg-gradient-to-r from-gray-50 to-gray-100 text-xs sm:text-sm font-semibold shadow-inner">
        月間合計: <span className="text-blue-600">{totalHours}</span> 時間 /{" "}
        <span className="text-green-600">{totalWage}</span> 円
      </div>
    </div>
  );
}

type Props = {
  storeName: string;
  tab: "morning" | "day" | "night";
  setTab: (tab: "morning" | "day" | "night") => void;
  currentMonth: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSave: () => void;
  onSubmit: () => void;
};

export default function ShiftHeader({
  storeName,
  tab,
  setTab,
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onSave,
  onSubmit,
}: Props) {
  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-black 
                    border-b p-4 shadow-lg text-white backdrop-blur-sm flex items-center justify-between">
      {/* 店舗名 */}
      <h2 className="font-extrabold text-2xl tracking-wide flex items-center gap-2">
        <span className="bg-blue-500 text-white px-3 py-1 rounded-lg shadow-md">
          {storeName}
        </span>
      </h2>

      {/* 右側 */}
      <div className="flex items-center gap-4">
        {/* 月移動 */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevMonth}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded-md shadow"
          >
            ◀
          </button>
          <span className="font-semibold">{currentMonth}</span>
          <button
            onClick={onNextMonth}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded-md shadow"
          >
            ▶
          </button>
        </div>

        {/* 朝昼夜タブ */}
        <div className="flex gap-3">
          {[
            { key: "morning", label: "🌅 朝", time: "0:00 ~ 9:00" },
            { key: "day", label: "🌞 昼", time: "9:00 ~ 16:00" },
            { key: "night", label: "🌙 夜", time: "16:00 ~ 24:00" },
          ].map(({ key, label, time }) => (
            <button
              key={key}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex flex-col items-center 
                ${
                  tab === key
                    ? "bg-blue-600 text-white shadow-md scale-105"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                }`}
              onClick={() => setTab(key as "morning" | "day" | "night")}
            >
              <span>{label}</span>
              <span className="text-xs opacity-80">{time}</span>
            </button>
          ))}
        </div>

        {/* 保存・提出 */}
        <div className="flex gap-2 ml-6">
          <button
            onClick={onSave}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg shadow-md text-sm font-semibold"
          >
            保存
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md text-sm font-semibold"
          >
            提出
          </button>
        </div>
      </div>
    </div>
  );
}

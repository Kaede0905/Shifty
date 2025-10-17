import { useState,useEffect} from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { MessageCircle, LogOut, User, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/fetch/useAuth";
import { usePullStoreInfo } from "@/components/fetch/usePullStoreInfo";
import { LoadingScreen } from "@/components/myUi/LoadingScreen";
import { UserHeader } from "@/components/myUi/userHeader";
import { UserMenu } from "@/components/myUi/UserMenu";

import moment from "moment";
import "moment/locale/ja";
import "react-big-calendar/lib/css/react-big-calendar.css";
import InfoBanner from "@/components/myUi/InfoBanner";
import MakeNewStoreModal from "@/components/fetch/MakeNewStoreModal";

const HomeEmployee = () => {
  const navigate = useNavigate();
  moment.locale("ja");
  const localizer = momentLocalizer(moment);
  const events = [
    { title: "バイト（17:00〜21:00）", start: new Date(2025, 8, 18, 17, 0), end: new Date(2025, 8, 18, 21, 0) },
    { title: "シフト提出締切", start: new Date(2025, 8, 20, 0, 0), end: new Date(2025, 8, 20, 23, 59) },
  ];
  const API_URL = import.meta.env.VITE_API_URL;
  const [isModalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const storeOnClick = ( Id: number ) => {
    navigate(`/store/${Id}`)
  }
  const [userData,setUserData] = useState({
    name: "ゲスト",
    image_url: "https://placehold.co/40x40/999999/FFFFFF?text=U",
  })
  const { loading, authenticated, user } = useAuth();
  const { stores } = usePullStoreInfo();
  useEffect (()=>{
    if(user){
      setUserData({
        name: user.name ?? "ゲスト",
        image_url: user.image_url ?? "https://placehold.co/40x40/999999/FFFFFF?text=U",
      })
    }
  },[user])
  if (loading) return <LoadingScreen />;
  if (!authenticated) return null;
  

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-black">
      <InfoBanner />
      <UserHeader userData={userData} setMenuOpen={setMenuOpen} />
      <UserMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main className="flex flex-1 flex-col md:flex-row gap-4 p-4">
        {/* 左カラム */}
        <div className="flex flex-col gap-4 w-full md:w-1/3">
          {/* 勤務先 */}
          <motion.div whileHover={{ scale: 1.02 }} className="cursor-pointer">
            <Card className="shadow-lg rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-md font-semibold">勤務先</h2>
                  <Button
                    size="sm"
                    className="bg-black text-white rounded-full px-4 shadow-md hover:scale-105 transform transition-transform"
                    onClick={() => setModalOpen(true)}
                  >
                    ＋追加
                  </Button>

                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {stores.length === 0 ? (
                    <p className="text-gray-500 text-center">追加ボタンをクリックして追加</p>
                  ) : (
                    stores.map((store) => (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="cursor-pointer"
                      >
                        <Card 
                          className="px-4 py-3 bg-white rounded-xl shadow-sm hover:shadow-md transition w-full"
                          onClick = {() => storeOnClick(store.id)}
                        >
                          <div className="flex items-center gap-4">
                            {/* ロゴ */}
                            <img
                              key={store.id}
                              src={store.logo_url ?? "https://placehold.co/60x60?text=No+Logo"}
                              alt="Store logo"
                              className="w-12 h-12 rounded-full shadow-md object-cover"
                            />

                            {/* 店舗名と認証ラベル */}
                            <div className="flex flex-col">
                              <p className="font-semibold text-base leading-tight">
                                {store.name}
                              </p>
                              <span
                                className={`text-xs ${
                                  store.store_type === "with_id"
                                    ? "text-green-600"
                                    : "text-gray-500"
                                }`}
                              >
                                {store.store_type === "with_id" ? "認証済み" : "非認証"}
                              </span>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </div>




              </CardContent>
            </Card>
                
          </motion.div>

          {/* お知らせ */}
          <motion.div whileHover={{ scale: 1.02 }} className="cursor-pointer">
            <Card className="shadow-lg rounded-2xl bg-gradient-to-r from-purple-50 to-purple-100">
              <CardContent className="p-4">
                <h2 className="text-md font-semibold mb-3">お知らせ</h2>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  <motion.div whileHover={{ scale: 1.02 }} className="cursor-pointer">
                    <Card className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition">
                      <p className="text-sm font-medium">シフト不足のお知らせ</p>
                      <p className="text-xs text-gray-500">コンビニ店長から - 9月15日</p>
                    </Card>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} className="cursor-pointer">
                    <Card className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition">
                      <p className="text-sm font-medium">シフト承認されました</p>
                      <p className="text-xs text-gray-500">ファミレス管理者から - 9月12日</p>
                    </Card>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* 右カラム */}
        <div className="flex-1 flex flex-col gap-4">
          {/* カレンダー */}
          <Card className="shadow-xl rounded-2xl overflow-hidden bg-gradient-to-b from-gray-300 to-gray-200">
            <CardContent className="p-4">
              <h2 className="text-md font-semibold mb-3">シフトカレンダー</h2>
              <div className="h-[380px] border border-gray-300 rounded-xl bg-white">
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: "100%" }}
                  popup
                  messages={{
                    next: "次へ",
                    previous: "前へ",
                    today: "今日",
                    month: "月",
                    week: "週",
                    day: "日",
                    agenda: "予定リスト",
                  }}
                  formats={{
                    weekdayFormat: (date) => moment(date).format("ddd"),
                    monthHeaderFormat: (date) => moment(date).format("YYYY年M月"),
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* 勤務時間・給与サマリー */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div whileHover={{ scale: 1.03 }} className="cursor-pointer">
              <Card className="p-4 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-xl shadow-sm hover:shadow-md transition">
                <p className="text-xl font-bold text-center text-indigo-800">32h</p>
                <p className="text-xs text-indigo-600 text-center">今月の勤務時間</p>
              </Card>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} className="cursor-pointer">
              <Card className="p-4 bg-gradient-to-r from-amber-100 to-amber-200 rounded-xl shadow-sm hover:shadow-md transition">
                <p className="text-xl font-bold text-center text-amber-800">¥48,000</p>
                <p className="text-xs text-amber-600 text-center">今月の給与</p>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      <MakeNewStoreModal 
        isModalOpen={isModalOpen}
        setModalOpen={setModalOpen}
      />
    </div>
  );
};

export default HomeEmployee;

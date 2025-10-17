import { useParams, useNavigate } from "react-router-dom";
import { usePullStoreInfo } from "@/components/fetch/usePullStoreInfo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, CheckCircle, X } from "lucide-react";
import { UserHeader } from "../../components/myUi/userHeader";
import { UserMenu } from "../../components/myUi/UserMenu";
import { useState,useEffect } from "react";
import { LoadingScreen } from "../../components/myUi/LoadingScreen";
import InfoBanner from "@/components/myUi/InfoBanner";
import WeekCalendar from "@/components/myUi/WeekShift";
import { useAuth } from "../../components/fetch/useAuth";
import { useConfirmDialog } from "@/components/myUi/UseConfirmDialog";
import { DeleteStore } from "@/components/fetch/DeleteStore";

const StoreTop = () => {
  const { id } = useParams<{ id: string }>();
  const { stores } = usePullStoreInfo();
  const [ConfirmDialog, openConfirm] = useConfirmDialog();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData,setUserData] = useState({
    name: "ゲスト",
    image_url: "https://placehold.co/40x40/999999/FFFFFF?text=U",
  })
  const { loading, authenticated, user } = useAuth();
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
  const storeId = Number(id);
  const store = stores.find((s) => s.id === storeId);
  if (!store) return <h1>店舗が見つかりません</h1>;
  const { deleteS } = DeleteStore(store.id);
  
  const handleDeleteStoreBotton = async() =>{ 
    const result = await openConfirm("店舗情報を消去しますか？",`${store.name}のすべての情報を消去します`);
    if (!result) return;
    const result2 = await openConfirm("本当に消去しますか？","消去すると二度と情報は戻りません");
    if (!result2) return;
    await deleteS();
  }
  // 仮データ（APIで取得する想定）
  const plannedHours = 120; // 今月予定勤務時間
  const plannedDays = 22;
  const confirmedHours = 95; // 確定勤務時間
  const confirmedDays = 12; // 確定勤務日数
  const salaryTotal = 120000;
  const salaryConfirmed = 95000;

  return (
    <>
    <UserHeader userData={userData} setMenuOpen={setMenuOpen} />
    <UserMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 店舗情報カード */}
        <Card className="relative p-4 rounded-xl shadow bg-white flex flex-col justify-between">
          <button
            onClick={handleDeleteStoreBotton}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          >
            <X size={30} />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={store.logo_url ?? "https://placehold.co/80x80?text=No+Logo"}
                alt="Store logo"
                className="w-16 h-16 rounded-full object-cover shadow"
                />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold">{store.name}</h1>
                  {store.store_type === "with_id" ? (
                    <CheckCircle className="text-green-600 w-5 h-5" />
                  ) : (
                    <span className="text-red-600 font-semibold text-sm">
                      非認証です
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  時給: {store.hourly_wage ? `${store.hourly_wage}円` : "未設定"}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600">住所: {store.address ?? "未登録"}</p>
            <p className="text-sm text-gray-600">電話番号: {store.phone_number ?? "未登録"}</p>
          </div>

          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 w-full"
              onClick={() => navigate(`/store/${storeId}/edit`)}
            >
              <Edit size={16} />
              編集
            </Button>
          </div>
        </Card>

        {/* カレンダー */}
        <div className="md:col-span-2 bg-white rounded-xl shadow p-4 md:p-6 flex items-center justify-center">
          <WeekCalendar 
            storeId={storeId}
            sundayDate=""
            saturdayDate=""
            />
        </div>
      </div>

      {/* 下部アクションボタン */}
        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <button
            onClick={() => navigate(`/store/${store.id}/calendar`)}
            className="flex-1 px-6 py-4 text-xl font-semibold bg-blue-500 text-white rounded-xl shadow hover:bg-blue-600 transition"
            >
            📅 カレンダーへ
          </button>
          <button
            onClick={() => navigate(`/store/${store.id}/shift`)}
            className="flex-1 px-6 py-4 text-xl font-semibold bg-green-500 text-white rounded-xl shadow hover:bg-green-600 transition"
            >
            ✍️ シフト編集
          </button>
        </div>

      {/* 給与・勤務情報カード */}
        <Card className="mt-6 p-4 md:p-6 bg-white rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-3">給与 & 勤務情報</h2>

          <div className="flex flex-col md:flex-row justify-between gap-4">
            {/* 左：給与 */}
            <div className="flex-1 bg-gray-50 p-6 rounded-xl text-center md:text-left">
              <p className="text-sm text-gray-500 mb-1">今月の給与</p>
              <p className="text-3xl md:text-4xl font-bold text-blue-600">{salaryTotal.toLocaleString()}円</p>
              <p className="text-base text-gray-700 mt-1">
                確定分: <span className="font-semibold text-gray-800">{salaryConfirmed.toLocaleString()}円</span>
              </p>
            </div>

            {/* 中央：確定勤務 */}
            <div className="flex-1 bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-sm text-gray-500 mb-1">確定勤務</p>
              <p className="text-2xl font-semibold">
                {confirmedHours}時間 / {confirmedDays}日
              </p>
            </div>
            {/* 右：予定勤務 */}
            <div className="flex-1 bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-sm text-gray-500 mb-1">今月予定勤務</p>
              <p className="text-2xl font-semibold text-blue-600">
                {plannedHours}時間 / {plannedDays}日
              </p>
            </div>

          </div>
        </Card>
        <InfoBanner />
    </div>
    {ConfirmDialog}
    </>
  );
};

export default StoreTop;

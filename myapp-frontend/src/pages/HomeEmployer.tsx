// HomeEmployer.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { EmployerHeader } from "@/components/myUi/EmployerHeader";
import { Store, Users, CalendarDays, X, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import StoreModal from "@/components/myUi/StoreModal";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs";
import { UsePullStoreEmployer } from "@/components/fetch/UsePullStoreEmployer";
import { LoadingScreen } from "@/components/myUi/LoadingScreen";
import { toast } from "sonner";
import type { StoreType } from "@/components/Type/StoreType";
import CreateStoreModal from "@/components/myUi/CreateStoreModal";
import { EmployerUserMenu } from "@/components/myUi/EmployerUserMenu";
import { EmployerEditStore } from "@/components/myUi/EmployerEditStore";

const HomeEmployer: React.FC = () => {
  const navigate = useNavigate();
  const [openStoreModal, setStoreModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreType | null>(null);
  const [openCreateModal, setCreateModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [refetchFlag, setRefetchFlag] = useState(0);
  const [menuUserMenuOpen, setUserMenuOpen] = useState(false);
  const [editMenuOpen, setEditMenuOpen] = useState(false);
  const { stores, user, loading, error } = UsePullStoreEmployer(refetchFlag);
  

  // ダミーデータのステート
  const [monthlySummary, setMonthlySummary] = useState({
    totalHours: 120,
    totalAmount: 250000,
    totalEmployees: 25,
  });

  // 月が変わるたびにダミーデータを更新
  useEffect(() => {
    const newSummary = {
      totalHours: Math.floor(Math.random() * 100) + 80,
      totalAmount: (Math.floor(Math.random() * 100) + 80) * 2000,
      totalEmployees: Math.floor(Math.random() * 20) + 10,
    };
    setMonthlySummary(newSummary);
  }, [currentMonth]);

  // ローカルストレージから前回選んだ店舗を復元
  useEffect(() => {
    if (!user?.id) return; 
    const savedStore = localStorage.getItem(`selectedStore_${user.id}`);
    if (savedStore) setSelectedStore(JSON.parse(savedStore));
  }, [user]);

  // 新しく店舗を選んだときに保存
  const handleSelectStore = (store: StoreType) => {
    setSelectedStore(store);
    if (user?.id) {
      localStorage.setItem(`selectedStore_${user.id}`, JSON.stringify(store));
    }
    setStoreModal(false);
  };

  // 店舗削除ボタン
  const handleDeleteStoreBotton = () => {
    if (!selectedStore || !user?.id) return;
    localStorage.removeItem(`selectedStore_${user.id}`);
    setSelectedStore(null);
  };
  const handleCopy = async () => {
    if (!selectedStore?.invite_code) return;
    await navigator.clipboard.writeText(selectedStore.invite_code);
    toast.success("招待コードををコピーしました！");
  };

  const menus = [
    { title: "従業員確認", icon: <Users className="w-8 h-8 text-blue-600" />, path: `/store/${selectedStore?.id}/employee/detail` },
    { title: "従業員シフト提出状況", icon: <CalendarDays className="w-8 h-8 text-purple-600" />, path: `/store/${selectedStore?.id}/employee/situation` },
    { title: "シフト編集", icon: <Edit className="w-8 h-8 text-green-600" />, path: `/store/${selectedStore?.id}/shifts/calender` },
    { title: "会社情報", icon: <Store className="w-8 h-8 text-orange-600" />, path: `/companies/info/${selectedStore?.company_id}`  },
  ];

  if (loading) return <LoadingScreen />;
  if (error) return <div>エラー: {error}</div>;
  return (
    <>
    <EmployerUserMenu menuOpen={menuUserMenuOpen} setMenuOpen={setUserMenuOpen} />
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* ヘッダー */}
        <EmployerHeader
          employerData={user}
          setStoreModal={setStoreModal}
          setUserMenuOpen={setUserMenuOpen}
        />
        {/* メイン */}
        <main className="flex-1 p-6 flex flex-col">
          {selectedStore ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* 左上：店舗情報カード */}
                <Card className="relative p-6 rounded-xl shadow bg-white flex flex-col justify-between lg:col-span-1">
                  <button
                    onClick={handleDeleteStoreBotton}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                  >
                    <X size={24} />
                  </button>

                  <div>
                    {/* 店舗名とロゴ */}
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={selectedStore.logo_url ?? "https://placehold.co/80x80?text=No+Logo"}
                        alt="Store logo"
                        className="w-16 h-16 rounded-full object-cover shadow"
                      />
                      <div>
                        <h1 className="text-xl font-bold text-green-700">{selectedStore.name}</h1>
                        <p className="text-xs text-gray-500">店舗情報</p>
                      </div>
                    </div>

                    {/* 店舗情報 */}
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-semibold text-gray-700">住所:</span>{" "}
                        <span className="text-gray-600">{selectedStore.address ?? "未登録"}</span>
                      </p>
                      <p>
                        <span className="font-semibold text-gray-700">電話番号:</span>{" "}
                        <span className="text-gray-600">{selectedStore.phone_number ?? "未登録"}</span>
                      </p>
                      {"invite_code" in selectedStore && (
                        <p>
                          <span className="font-semibold text-gray-700">招待コード:</span>{" "}
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                            {selectedStore.invite_code}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCopy}
                            className="hover:bg-blue-50 hover:text-blue-600 transition"
                          >
                            コピー
                          </Button>
                        </p>
                      )}
                      {"member" in selectedStore && (
                        <p>
                          <span className="font-semibold text-gray-700">登録済み従業員数:</span>{" "}
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-xs font-medium">
                            {selectedStore.member}人
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 編集ボタン */}
                  <div className="mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 w-full hover:bg-green-50 hover:text-green-700"
                      onClick={() => setEditMenuOpen(true)}
                    >
                      <Edit size={16} />
                      編集
                    </Button>
                  </div>
                </Card>

                {/* 右側にメニュー */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {menus.map((menu, index) => (
                    <motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Card
                        onClick={() => navigate(menu.path)}
                        className="cursor-pointer rounded-2xl shadow-lg bg-white hover:shadow-xl transition flex flex-col items-center justify-center p-6 text-center"
                      >
                        {menu.icon}
                        <CardContent className="mt-4">
                          <h2 className="text-lg font-bold">{menu.title}</h2>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 月ナビゲーション */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-center gap-6 py-4 bg-gray-50 rounded-xl shadow">
                  <button
                    onClick={() => setCurrentMonth(prev => prev.subtract(1, "month"))}
                    className="p-2 rounded-full hover:bg-gray-200 transition"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                  </button>

                  <span className="text-lg font-semibold text-gray-700">
                    {currentMonth.format("YYYY年 M月")}
                  </span>

                  <button
                    onClick={() => setCurrentMonth(prev => prev.add(1, "month"))}
                    className="p-2 rounded-full hover:bg-gray-200 transition"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                {/* 今月の総額・総時間・人数 */}
                <div className="p-4 bg-white rounded-xl shadow flex justify-around items-center">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">今月の総時間</p>
                    <p className="text-lg font-bold text-purple-600">{monthlySummary.totalHours}時間</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">今月の総額</p>
                    <p className="text-lg font-bold text-green-600">￥{monthlySummary.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">今月働いた人数</p>
                    <p className="text-lg font-bold text-blue-600">{monthlySummary.totalEmployees}人</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[70vh] text-gray-600">
              <h2 className="text-xl font-semibold mb-4">店舗が選択されていません</h2>
              <p className="text-center text-base leading-relaxed">
                まずは{" "}
                <span
                  className="font-semibold text-green-600 underline underline-offset-4 cursor-pointer transition-colors duration-300 hover:text-green-800"
                  onClick={() => setStoreModal(true)}
                >
                  「店舗選択」
                </span>{" "}
                から店舗を選んでください。
              </p>
            </div>
          )}
        </main>
      </div>
      {selectedStore && user && (
        <EmployerEditStore
          editMenuOpen={editMenuOpen}
          setEditMenuOpen={setEditMenuOpen}
          store={selectedStore}
          setSelectedStore={setSelectedStore}
          id={user.id}
          refetchFlag={refetchFlag}
          setRefetchFlag={setRefetchFlag}
        />
      )}
      {/* 店舗選択モーダル */}
      <StoreModal
        openStoreModal={openStoreModal}
        setStoreModal={setStoreModal}
        setCreateModal={setCreateModal}
        stores={stores}
        onSelect={(store) => handleSelectStore(store as StoreType)}
      />
      <CreateStoreModal
        openCreateModal={openCreateModal}
        setCreateModal={setCreateModal}
        refetchFlag={refetchFlag}
        setRefetchFlag={setRefetchFlag}
        setStoreModal={setStoreModal}
      />
    </>
  );
};

export default HomeEmployer;

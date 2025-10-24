import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { LoadingScreen } from "@/components/myUi/LoadingScreen";
import { UsePullstoreEmployee } from "@/components/fetch/UsePullStoreEmployee";
import { EmployerHeaderNoStore } from "@/components/myUi/EmployerHeaderNoStore";
import { useNavigate } from "react-router-dom";
import { EmployeeDetailModal } from "@/components/myUi/EmployeeDetailModal";
import { EmployerUserMenu } from "@/components/myUi/EmployerUserMenu";

interface EmployeeData {
  id: number;
  assign_id: number;
  name: string;
  image_url: string;
  salary: number;
  night_salary: number;
  role: string;
}

const StoreEmployee: React.FC = () => {
  const [refetchFlag, setRefetchFlag] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [menuUserMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const handleOpenModal = (employee: EmployeeData) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEmployee(null);
  };
  const { id } = useParams<{ id: string }>();
  const storeId = id ? Number(id) : null;
  if (!storeId) {
    return <p className="text-red-500">店舗IDが不正です</p>;
  }

  const { users, loading, error } = UsePullstoreEmployee(storeId, refetchFlag);

  if (loading) return <LoadingScreen />;
  if (error) return <p className="text-red-500">エラー: {error}</p>;

  // users が空だった場合の画面
  if (users.length === 0) {
    return (
      <>
        <EmployerHeaderNoStore 
          setUserMenuOpen={setUserMenuOpen}
        />
        <EmployerUserMenu 
          menuOpen={menuUserMenuOpen}
          setMenuOpen={setUserMenuOpen}
        />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">従業員が登録されていません</h1>
          <p className="text-gray-600 mb-6">この店舗に従業員を追加してください。</p>
          <Button
            size="lg"
            variant="default"
            className="bg-green-600 text-white hover:bg-green-700"
            onClick={()=>navigate("/home/employer")}
            >
            Homeに戻る
          </Button>
        </div>
      </>
    );
  }

  // 通常の一覧表示
  return (
    <>
    <EmployerHeaderNoStore 
      setUserMenuOpen={setUserMenuOpen}
    />
    <EmployerUserMenu 
       menuOpen={menuUserMenuOpen}
      setMenuOpen={setUserMenuOpen}
    />
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">従業員一覧</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((emp: EmployeeData) => (
          <Card
          key={emp.id}
          className="p-4 rounded-xl shadow hover:shadow-md bg-white transition"
          >
            {/* 名前と画像 */}
            <div className="flex items-center gap-3 mb-3">
              <img
                src={emp.image_url || "https://placehold.co/80x80?text=User"}
                alt={emp.name}
                className="w-12 h-12 rounded-full object-cover"
                />
              <div>
                <h2 className="text-lg font-semibold">{emp.name}</h2>
                <p className="text-sm text-gray-500">従業員</p>
              </div>
            </div>

            {/* 給与情報 */}
            <div className="mb-3">
              <p className="text-sm text-gray-700">
                役職: <span className="font-semibold">{emp.role ? emp.role : "未設定"}</span>
              </p>
              <p className="text-sm text-gray-700">
                時給: <span className="font-semibold">{emp.salary ? `${emp.salary}円` : "未設定"}</span>
              </p>
              <p className="text-sm text-gray-700">
                深夜時給: <span className="font-semibold">{emp.night_salary ? `${emp.night_salary}円` : "未設定"}</span>
              </p>
            </div>

            {/* アクションボタン */}
            <div className="mt-4">
              <Button
                size="sm"
                variant="outline"
                className="w-full hover:bg-green-50 hover:text-green-700"
                onClick={() => {
                  setSelectedEmployee(emp);
                  setModalOpen(true);
                }}
                >
                詳細を見る
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
    <EmployeeDetailModal
        open={modalOpen}
        onClose={handleCloseModal}
        employee={selectedEmployee}
        refetchFlag={refetchFlag}
        setRefetchFlag={setRefetchFlag}
      />
    </>
  );
};

export default StoreEmployee;

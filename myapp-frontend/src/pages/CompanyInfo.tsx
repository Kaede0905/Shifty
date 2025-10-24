import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CompanyInfo = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API_URL}/api/v1/companies/${id}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.errors || "取得に失敗しました");
        setCompany(data.company);
      } catch (error) {
        console.error(error);
        toast.error("会社情報の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  const handleCopy = async () => {
    if (!company?.public_id) return;
    await navigator.clipboard.writeText(company.public_id);
    toast.success("会社公開IDをコピーしました！");
  };

  if (loading) return <div className="p-6 text-center">読み込み中...</div>;
  if (!company) return <div className="p-6 text-center text-gray-500">会社情報が見つかりません。</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">会社情報</h1>
      <div className="bg-white shadow rounded-xl p-6 space-y-4 border border-gray-200">
        <div>
          <p className="text-gray-500 text-sm">会社名</p>
          <p className="text-lg font-medium">{company.name}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">契約ステータス</p>
          <p className="text-lg">{company.status}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">契約料金</p>
          <p className="text-lg">¥{Number(company.contract_fee).toLocaleString()}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">契約期間</p>
          <p className="text-lg">
            {company.contract_start_at
              ? `${new Date(company.contract_start_at).toLocaleDateString()} 〜 ${new Date(
                  company.contract_end_at
                ).toLocaleDateString()}`
              : "未設定"}
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">ロゴ</p>
          {company.logo_url ? (
            <img
              src={company.logo_url}
              alt="Company Logo"
              className="w-20 h-20 object-cover rounded-md border"
            />
          ) : (
            <p className="text-gray-400">なし</p>
          )}
        </div>

        <div className="border-t pt-4">
          <p className="text-gray-500 text-sm mb-1">会社公開ID</p>
          <div className="flex items-center gap-2">
            <code className="px-3 py-2 bg-gray-100 rounded font-mono text-blue-600 text-sm border border-gray-300">
              {company.public_id}
            </code>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              className="hover:bg-blue-50 hover:text-blue-600 transition"
            >
              コピー
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            ※ この <strong>会社公開ID</strong> は雇用者アカウントの作成、ログインで使用します。<strong className="text-red-500">必ず</strong>コピーし、メモ等に必ず保存してください。
          </p>
          <div className="mt-6">
            <button
              onClick={async() => {
                navigate(-1)
              }}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
            >
              ← 戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfo;

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

export default function MakeAccountEmployer() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [mailError, setMail] = useState(false);
  const [passError, setPass] = useState(false);
  const [idError, setId] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    companyPublicId: "", // ← 会社の公開ID
    role: "", // デフォルト
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMail(false);
    setPass(false);
    setId(false);
    
    if (form.password !== form.passwordConfirm) {
      setPass(true);
      toast("パスワードが一致しません", {
        description: "再度パスワードを確認してください",
      });
      return;
    }
    if (form.password.length < 6) {
      setPass(true);
      toast("パスワードが短すぎます", {
        description: "パスワードは６文字以上にしてください",
      });
      return;
    }

    if (!form.companyPublicId) {
      setId(true)
      toast("会社IDが必要です", { description: "companies.public_id を入力してください" });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/v1/employer_accounts`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employer_account: {
            name: form.name,
            email: form.email,
            password: form.password,
            role: form.role,
            company_public_id: form.companyPublicId, 
            // ← API 側で public_id を company_id に解決させる
          },
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast("登録成功", { description: "雇用者アカウントが作成されました" });
        navigate("/home/employer");
      } else {
        if (data.errors == "Email has already been taken") {
          setMail(true);
          toast("登録失敗", { description: "このEmailはすでに使用されています" });
        }else if(data.errors?.includes("public_id was not found")){ 
          setId(true)
          toast("登録失敗", { description: "会社公開IDが間違っているか、登録されていません" });
        } else {
          toast("登録失敗", {
            description: data.errors?.join(", ") || "不明なエラーです",
          });
        }
      }
    } catch (error) {
      toast("通信エラー", { description: "サーバーに接続できませんでした" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-pink-50 flex items-center justify-center px-6 py-20">
      <motion.div
        className="w-full max-w-md relative"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Card className="p-8 shadow-2xl rounded-3xl">
          {/* ✖ 閉じるボタン */}
            <button
              onClick={() => navigate("/signin")}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={35} />
            </button>
          <CardHeader className="mb-6 text-center">
            <CardTitle className="text-3xl font-bold text-slate-900">
              雇用者アカウント作成
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* 氏名 */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-slate-700">氏名</label>
                <Input
                  type="text"
                  name="name"
                  placeholder="例：佐藤 一郎"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* 役職 */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-slate-700">役職</label>
                <Input
                  type="text"
                  name="role"
                  placeholder="マネージャー"
                  value={form.role}
                  onChange={handleChange}
                  className="border rounded-lg p-2"
                />
              </div>


              {/* メール */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-slate-700">メールアドレス</label>
                <Input
                  type="email"
                  name="email"
                  placeholder="example@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={`${mailError ? "border-red-500" : ""}`}
                />
              </div>

              {/* パスワード */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-slate-700">パスワード</label>
                <Input
                  type="password"
                  name="password"
                  placeholder="パスワード"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className={`${passError ? "border-red-500" : ""}`}
                />
              </div>

              {/* パスワード確認 */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-slate-700">パスワード確認</label>
                <Input
                  type="password"
                  name="passwordConfirm"
                  placeholder="パスワード確認"
                  value={form.passwordConfirm}
                  onChange={handleChange}
                  required
                  className={`${passError ? "border-red-500" : ""}`}
                />
              </div>

              {/* 会社公開ID */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-slate-700">会社公開ID</label>
                <Input
                  type="text"
                  name="companyPublicId"
                  placeholder="例：COMPANY-ABC123"
                  value={form.companyPublicId}
                  onChange={handleChange}
                  required
                  className={`${idError ? "border-red-500" : ""}`}
                />
              </div>


              {/* 送信ボタン */}
              <Button type="submit" className="w-full mt-4 shadow-lg hover:scale-105 transition-transform">
                アカウント作成
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// src/pages/Login.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Mail, ShieldCheck, X } from "lucide-react"; // ✅ Xアイコンを追加
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import InfoBanner from "@/components/myUi/InfoBanner";

export default function Login() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate()
  const [role, setRole] = useState<"employee" | "employer">("employee");
  const [form, setForm] = useState({
    email: "",
    password: "",
    public_id: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/v1/auth`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_account: {
            type: role,
            email: form.email,
            password: form.password,
            public_id: form.public_id,
          },
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast("ログイン成功", { description: "認証されました" });
        navigate(`/home/${data.userType}`);
      } else {
        if (data.errors) {
          toast("ログイン失敗", {
            description: data.errors,
            action: {
              label: "閉じる",
              onClick: () => console.log("Undo"),
            },
          });
        }
      }
    } catch (err) {
      toast("通信エラー", { description: "サーバーに接続できませんでした" });
    }
  };

  return (
    <div className="h-screen w-screen relative bg-gradient-to-b from-blue-50 via-white to-pink-50 flex flex-col overflow-hidden">
      {/* ✅ info メッセージバナー */}
      <InfoBanner />


      {/* 背景装飾 */}
      <motion.div
        className="absolute top-[-200px] left-1/2 w-[600px] h-[600px] 
                  -translate-x-1/2 rounded-full 
                  bg-gradient-to-r from-blue-200 to-pink-200 
                  opacity-20 blur-3xl 
                  pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 120, ease: "linear" }}
      />

      {/* 中央コンテンツ */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md"
        >
         <Card className="p-8 shadow-lg rounded-3xl relative">
            {/* ✖ 閉じるボタン */}
            <button
              onClick={() => navigate("/")}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={35} />
            </button>
            <CardHeader className="mb-6 text-center">
              <CardTitle className="text-2xl font-bold text-gray-800">
                アカウントにログイン
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* ロール選択 */}
              <div className="flex justify-center gap-6 mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="employee"
                    checked={role === "employee"}
                    onChange={() => setRole("employee")}
                    className="accent-blue-600"
                  />
                  被雇用者
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="employer"
                    checked={role === "employer"}
                    onChange={() => setRole("employer")}
                    className="accent-green-600"
                  />
                  雇用者
                </label>
              </div>

              {/* フォーム */}
              <motion.form
                onSubmit={handleLogin}
                className="flex flex-col gap-5"
                layout
              >
                {/* メール */}
                <div className="flex items-center gap-3 border rounded-lg px-4 py-3 bg-gray-50 focus-within:ring-2 ring-blue-400">
                  <Mail className="text-gray-400" size={20} />
                  <Input
                    type="email"
                    name="email"
                    placeholder="メールアドレス"
                    className="border-none bg-transparent focus-visible:ring-0"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* パスワード */}
                <div className="flex items-center gap-3 border rounded-lg px-4 py-3 bg-gray-50 focus-within:ring-2 ring-blue-400">
                  <Lock className="text-gray-400" size={20} />
                  <Input
                    type="password"
                    name="password"
                    placeholder="パスワード"
                    className="border-none bg-transparent focus-visible:ring-0"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* 雇用者専用： 会社公開ID*/}
                {role === "employer" && (
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-3 border rounded-lg px-4 py-3 bg-gray-50 focus-within:ring-2 ring-green-500">
                      <ShieldCheck className="text-gray-400" size={20} />
                      <Input
                        type="text"
                        name="public_id"
                        placeholder="会社公開ID"
                        className="border-none bg-transparent focus-visible:ring-0"
                        value={form.public_id}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </motion.div>
                )}

                {/* ログインボタン */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full shadow hover:scale-105 transition-transform"
                >
                  ログイン
                </Button>
              </motion.form>

              {/* 被雇用者のみ：LINEログイン */}
              {role === "employee" && (
                <motion.div layout className="mt-6">
                  <div className="my-6 flex items-center gap-4">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="text-gray-500 text-sm">または</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                  </div>

                  <a
                    href={`${API_URL}/auth/line?mode=login`}
                    className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-xl transition-transform transform hover:-translate-y-1 hover:scale-105 w-full text-lg"
                  >
                    💚 LINEでかんたんログイン
                  </a>
                </motion.div>
              )}

              <div className="mt-8">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-blue-500 text-blue-600 hover:bg-blue-50"
                  onClick={() => navigate("/signin")}
                >
                  アカウントをお持ちでない方はこちら
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

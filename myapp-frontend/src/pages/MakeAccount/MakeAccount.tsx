import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase } from "lucide-react";
import { motion} from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

import InfoBanner from "@/components/myUi/InfoBanner";
import ChoiceModal from "@/components/myUi/ChoiceModal"

export default function SelectAccountType() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [showSignUpChoice, setShowSignUpChoice] = useState(false);

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-blue-50 via-white to-pink-50 flex flex-col items-center px-6 py-20 overflow-hidden">
      {/* ✅ info メッセージバナー */}
      <InfoBanner />

      {/* 背景装飾 */}
      <motion.div
        className="absolute top-[-200px] left-1/2 w-[600px] h-[600px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-200 to-pink-200 opacity-20 blur-3xl"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 120, ease: "linear" }}
      />

      {/* ページタイトル */}
      {/* ✖ 閉じるボタン */}
            <button
              onClick={() => navigate("/")}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={35} />
            </button>
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-slate-900 mb-16 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        アカウント作成
      </motion.h1>

      {/* 選択カード */}
      <motion.div
        className="relative max-w-3xl w-full grid md:grid-cols-2 gap-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* 被雇用者 */}
        <Card
          className="p-8 shadow-lg rounded-3xl hover:-translate-y-2 hover:scale-105 transition-transform cursor-pointer"
          onClick={() => setShowSignUpChoice(true)}
        >
          <CardHeader className="flex flex-col items-center text-center mb-4">
            <Users className="w-16 h-16 text-blue-500 mb-4" />
            <CardTitle className="text-2xl font-bold">被雇用者</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-600 text-center">
            シフトを提出・確認・給与管理まで。直感的に操作できる被雇用者向けアカウントです。
          </CardContent>
        </Card>

        {/* 雇用者 */}
        <Card
          className="p-8 shadow-lg rounded-3xl hover:-translate-y-2 hover:scale-105 transition-transform cursor-pointer"
          onClick={() => navigate("/signin/employer")}
        >
          <CardHeader className="flex flex-col items-center text-center mb-4">
            <Briefcase className="w-16 h-16 text-green-500 mb-4" />
            <CardTitle className="text-2xl font-bold">雇用者</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-600 text-center">
            シフト提出状況や役職管理、給与計算まで可能。チーム運営を効率化する雇用者向けアカウントです。
          </CardContent>
        </Card>
      </motion.div>

      {/* 既存ユーザー用ボタン */}
      <motion.div
        className="mt-12 w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Button
          size="lg"
          className="w-full shadow hover:scale-105 transition-transform"
          onClick={() => navigate("/login")}
        >
          既にアカウントをお持ちの方はこちら
        </Button>
      </motion.div>

      {/* 被雇用者用モーダル */}
      <ChoiceModal
        isOpen={showSignUpChoice}
        onClose={() => setShowSignUpChoice(false)}
        title="被雇用者新規登録"
        description="登録方法を選んでください"
        options={[
          {
            label: "📧 メールで登録",
            href: "/signin/employee/email",
            className: "bg-gray-800 hover:bg-gray-900 text-white",
          },
          {
            label: "💚 LINEで登録",
            href: `${API_URL}/auth/line?mode=register`,
            className: "bg-green-600 hover:bg-green-700 text-white",
          },
        ]}
      />
    </div>
  );
}

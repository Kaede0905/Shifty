import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck, Users, Wallet, CheckCircle2, Bell, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


export default function Top() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 relative overflow-hidden">

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center py-28 px-6">
        <motion.h1 className="text-4xl md:text-5xl font-bold text-slate-900"
          initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          シフト管理をもっとスマートに
        </motion.h1>
        <motion.p className="mt-6 text-lg text-slate-700 leading-relaxed max-w-2xl mx-auto"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1 }}>
          被雇用者・雇用主それぞれに最適化されたシフト管理アプリ。
          時間・給与管理からシフト提出、承認までスムーズに。
        </motion.p>
        <motion.div className="mt-12 flex justify-center gap-6"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 0.8 }}>
          <Button 
            size="lg" 
            className="px-10 py-3 shadow-lg hover:scale-105 transition-transform"
            onClick={()=>navigate("/login")}>
              ログイン
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="px-10 py-3 shadow-lg hover:scale-105 transition-transform"
            onClick={()=>navigate("/signin")}>
              新規登録
          </Button>
        </motion.div>
      </section>

      {/* 被雇用者向け機能 */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">被雇用者向け機能</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <CalendarCheck className="w-12 h-12 text-blue-500" />, title: "締め日・給料日管理", desc: "バイトごとの締め日と給料日を簡単に管理。" },
            { icon: <Wallet className="w-12 h-12 text-amber-500" />, title: "勤務時間・給与計算", desc: "月ごとの勤務時間と給与を自動計算。時給設定も可能。" },
            { icon: <Bell className="w-12 h-12 text-green-500" />, title: "シフト送信・確認", desc: "雇用主へ送信・承認されたシフトを確認できます。" },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.2 }}>
              <Card className="p-6 shadow-xl rounded-2xl hover:-translate-y-2 hover:scale-105 transition-transform">
                <CardHeader className="flex flex-col items-center text-center">
                  {item.icon}
                  <CardTitle className="text-xl font-medium">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-slate-600 mt-2 text-center">{item.desc}</CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 雇用主向け機能 */}
      <section className="max-w-6xl mx-auto px-6 py-20 bg-slate-50 rounded-3xl">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">雇用主向け機能</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <Users className="w-12 h-12 text-green-500" />, title: "シフト提出状況管理", desc: "シフトの提出状況を一目で確認できます。" },
            { icon: <CalendarCheck className="w-12 h-12 text-blue-500" />, title: "日別シフト編集", desc: "誰が何時から働けるかを編集・追加・削除可能。" },
            { icon: <DollarSign className="w-12 h-12 text-amber-500" />, title: "給与・人件費管理", desc: "役職ごとの給料や人件費、深夜料金も自動計算。" },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.2 }}>
              <Card className="p-6 shadow-xl rounded-2xl hover:-translate-y-2 hover:scale-105 transition-transform">
                <CardHeader className="flex flex-col items-center text-center">
                  {item.icon}
                  <CardTitle className="text-xl font-medium">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-slate-600 mt-2 text-center">{item.desc}</CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 使い方フロー */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-14">使い方</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step:"1", title:"シフト作成", icon:<CalendarCheck className="w-12 h-12 text-blue-500"/> },
            { step:"2", title:"送信", icon:<Users className="w-12 h-12 text-green-500"/> },
            { step:"3", title:"承認", icon:<CheckCircle2 className="w-12 h-12 text-amber-500"/> },
            { step:"4", title:"勤怠管理", icon:<Wallet className="w-12 h-12 text-purple-500"/> },
          ].map((item,i)=>(
            <motion.div key={i} initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:i*0.2}}>
              <Card className="p-6 shadow-md rounded-2xl hover:-translate-y-2 hover:scale-105 transition-transform text-center">
                {item.icon}
                <div className="mt-3 font-medium">{item.title}</div>
                <div className="text-slate-600 mt-1 text-sm">ステップ {item.step}</div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto text-center py-20 px-6">
        <motion.div className="flex justify-center gap-6" initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} transition={{duration:0.8}}>
          <Button 
            size="lg" 
            className="px-10 py-3 shadow-lg hover:scale-105 transition-transform"
            onClick={()=>navigate("/login")}>
              今すぐログイン
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="px-10 py-3 shadow-lg hover:scale-105 transition-transform"
            onClick={()=>navigate("/signin")}>
              新規登録
          </Button>
        </motion.div>
      </section>
    </div>
  )
}

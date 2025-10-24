import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { data, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { X } from "lucide-react";

const CompanyCreate = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("会社名を入力してください");
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/api/v1/companies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          company: { name },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("登録に失敗しました");
      toast.success("会社を登録しました");
      navigate(`/companies/${data.company.id}`);
    } catch (error) {
      console.error(error);
      toast.error("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow">
      <button
                onClick={()=>navigate("/signin")}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
      <h1 className="text-2xl font-bold mb-6 text-center">会社登録</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">会社名</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例）株式会社ABC"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full shadow hover:scale-105 transition-transform"
          disabled={loading}
        >
          {loading ? "登録中..." : "登録する"}
        </Button>
      </form>
    </div>
  );
};

export default CompanyCreate;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type StoreFormData = {
  name: string;
  address: string;
  phone_number: string;
  logo_url?: string;
};

const EditStoreEmployee = ({ onSubmit }: { onSubmit: (data: StoreFormData) => void }) => {
  const [formData, setFormData] = useState<StoreFormData>({
    name: "",
    address: "",
    phone_number: "",
    logo_url: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, logo_url: imageUrl }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md p-4">
      <div>
        <Label htmlFor="name">店舗名</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div>
        <Label htmlFor="address">住所</Label>
        <Input id="address" name="address" value={formData.address} onChange={handleChange} />
      </div>

      <div>
        <Label htmlFor="phone_number">電話番号</Label>
        <Input id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} />
      </div>

      <div>
        <Label htmlFor="logo">店舗ロゴ</Label>
        <Input id="logo" type="file" accept="image/*" onChange={handleLogoChange} />
        {formData.logo_url && (
          <div className="mt-2">
            <img src={formData.logo_url} alt="Logo Preview" className="h-20 w-20 object-cover rounded-md" />
          </div>
        )}
      </div>

      <Button type="submit" className="w-full">
        保存する
      </Button>
    </form>
  );
};

export default EditStoreEmployee;

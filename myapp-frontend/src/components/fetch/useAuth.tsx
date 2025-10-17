import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Employee = {
  id: number;
  name: string;
  image_url?: string;
};
export const useAuth = () => {

  const API_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<Employee | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/employee/authenticated`, {
          credentials: "include"
        });
        const data = await res.json();

        if (res.ok && data.authenticated) {
          setAuthenticated(true);
          setUser(data.user); // ユーザー情報を保存
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error(error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [API_URL, navigate]);

  return { loading, authenticated, user };
};

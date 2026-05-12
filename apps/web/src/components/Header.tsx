import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
}

const Header = () => {
  const API_URL = "http://localhost:3001";
  const id = 2;

  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const result = await fetch(`${API_URL}/users/${id}`);
      if (!result.ok) throw new Error("Network error");
      const data = await result.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  useEffect(() => {
    fetchUser().then(data => {
      if (data) setUser(data);
    });
  }, [id]);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm px-6 py-4">
        Värderingskollen
        <button onClick={() => fetchUser()} className="bg-amber-400 border px-0.5 flex right-0">
          Logga in {user?.name}
        </button>
      </div>
    </>
  );
};

export default Header;
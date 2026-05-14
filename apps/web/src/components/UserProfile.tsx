import { useState, useEffect } from "react";
import pp from "../assets/account.svg";
import UserResults from "./UserResults";

interface User {
  name: string;
  givenName: string;
  surname: string;
  personalNumber: string;
}

const UserProfile = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/me`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => { if (data) setUser(data); })
      .catch((err) => console.error("Failed to fetch user:", err));
  }, []);

  if (!user) return <p>Laddar...</p>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 font-semibold px-6 py-3 rounded-lg transition-colors duration-200 shadow-md bg-primary-100">
        <img src={pp} />
        <div>
          <h2>{user.givenName} {user.surname}</h2>
          <p>{user.personalNumber}</p>
        </div>
      </div>
      <UserResults />
    </div>
  );
};

export default UserProfile;
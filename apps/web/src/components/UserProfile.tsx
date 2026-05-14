import { useState, useEffect } from "react";
import pp from "../assets/account.svg";
import UserResults from "./UserResults";

interface User {
  id: number;
  name: string;
  givenname: string;
  surname: string;
  personalNumber: string;
}

const UserProfile = () => {
  const API_URL = "http://localhost:3001";
  const id = 0;

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
    fetchUser().then((data) => {
      if (data) setUser(data);
    });
  }, [id]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 font-semibold px-6 py-3 rounded-lg transition-colors duration-200 shadow-md bg-primary-100">
        <img src={pp}></img>
        <div>
          <h2>
            {user?.givenname} {user?.surname}
          </h2>
          <p>{user?.personalNumber}</p>
        </div>
      </div>{" "}
      <UserResults />
    </div>
  );
};

export default UserProfile;

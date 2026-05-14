import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  givenname: string;
  surname: string,
  personalNumber: string,
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
    fetchUser().then(data => {
      if (data) setUser(data);
    });
  }, [id]);

  return (
    <div className="border gap-5 mx-5 px-5">
      <div>UserProfile {user?.id}</div>
      <div>
        <h2>{user?.givenname} {user?.surname}</h2>
        <p>{user?.personalNumber}</p>
      </div>
    </div>
  );
};

export default UserProfile;

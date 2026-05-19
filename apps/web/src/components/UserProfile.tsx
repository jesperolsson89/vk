import { useUser } from "../context/UserContext";
import pp from "../assets/account.svg";
import UserResults from "./UserResults";

const UserProfile = () => {
  const { user, isLoading } = useUser();

  if (isLoading) return <p>Laddar...</p>;
  if (!user) return <p>Du måste logga in för att se den här sidan.</p>;

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
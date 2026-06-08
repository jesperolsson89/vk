import { useUser } from "../context/UserContext";
import { useEffect, useState } from "react";
import pp from "../assets/account.svg";

interface TestResult {
  id: string;
  completedAt: string;
  ratings: Record<string, number>;
  topValues: string[];
}

const UserProfile = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { user, isLoading } = useUser();
  const [results, setResults] = useState<TestResult[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/results`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then(setResults)
      .catch((err) => console.error("Failed to fetch results:", err));
  }, []);

  if (isLoading) return <p>Laddar...</p>;
  if (!user) return <p>Du måste logga in för att se den här sidan.</p>;

  const latest = results[0];

  return (
    <div className="flex flex-col gap-4 mt-6 mb-20">
      <div className="flex items-center gap-3 font-semibold px-6 py-3 rounded-lg transition-colors duration-200 shadow-md bg-primary-100">
        <img src={pp} />
        <div>
          <h2>
            {user.givenName} {user.surname}
          </h2>
          <p>{user.personalNumber.slice(0, -4) + "****"}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 font-semibold px-6 py-3 rounded-lg transition-colors duration-200 shadow-md bg-primary-100">
        <h2>Mina viktigaste värderingar just nu:</h2>
        {latest ? (
          <>
            <p className="text-sm font-normal text-text-muted">
              {new Date(latest.completedAt).toLocaleDateString("sv-SE")}
            </p>
            <ol className="list-decimal list-inside flex flex-col gap-1 font-normal">
              {(latest.topValues as string[]).map((value, i) => (
                <li key={i} className="text-text">
                  {value}
                </li>
              ))}
            </ol>
          </>
        ) : (
          <p className="font-normal text-text-muted">
            Inga resultat sparade än.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 font-semibold px-6 py-3 rounded-lg transition-colors duration-200 shadow-md bg-primary-100">
        <h2>Historik:</h2>
        {results.length <= 1 ? (
          <p className="font-normal text-text-muted">Inga tidigare resultat.</p>
        ) : (
          results.slice(1).map((result) => (
            <div
              key={result.id}
              className="flex flex-col gap-1 font-normal border-t border-border pt-2"
            >
              <p className="text-sm text-text-muted">
                {new Date(result.completedAt).toLocaleDateString("sv-SE")}
              </p>
              <ol className="list-decimal list-inside flex flex-col gap-1">
                {(result.topValues as string[]).map((value, i) => (
                  <li key={i} className="text-text">
                    {value}
                  </li>
                ))}
              </ol>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserProfile;

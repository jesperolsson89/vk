import { useState, useEffect, useRef } from "react";
import BankButton from "./BankButton";
import pp from "../assets/account.svg";

interface User {
  givenName: string;
  name: string;
}

const Header = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Check if already logged in on mount
  useEffect(() => {
    fetch(`${API_URL}/api/me`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => { if (data) setUser(data); })
      .catch(() => {});
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    await fetch(`${API_URL}/api/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    setMenuOpen(false);
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-primary-600 border-b border-primary-700 shadow-sm px-6 py-3 flex items-center justify-between">
      <h1 className="text-text-light font-semibold">Värderingskollen</h1>

      {user ? (
        // Logged in — show user menu
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-text-light px-4 py-2 rounded-lg transition-colors"
          >
            <img src={pp} className="w-6 h-6" />
            <span className="font-medium">{user.givenName}</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-border overflow-hidden animate-[slideUp_0.15s_ease]">
              
                <a href="/profile"
                className="flex items-center gap-2 px-4 py-3 text-text hover:bg-neutral-50 transition-colors"
              >
                Min profil
              </a>
              <hr className="border-border" />
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 transition-colors">
                Logga ut
              </button>
            </div>
          )}
        </div>
      ) : (
        // Not logged in — show login button
        <BankButton onLogin={setUser} />
      )}
    </div>
  );
};

export default Header;
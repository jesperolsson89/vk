import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useUser } from "../context/UserContext";

const Layout = () => {
  const { user, isLoading } = useUser();

  return (
    <>
      <Header />
      <div className="flex flex-col min-h-screen items-center bg-primary-200 pt-16">
        {isLoading ? null : user ? (
          <Outlet />
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 mt-20">
            <h2 className="text-4xl font-bold text-primary-900">
              Välkommen till Värderingskollen!
            </h2>
            <p className="text-primary-700 text-2xl">
              Logga in med BankID för att påbörja testet.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Layout;
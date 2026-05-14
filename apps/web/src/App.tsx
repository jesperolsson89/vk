import "./App.css";
import BankButton from "./components/BankButton";
import Footer from "./components/Footer";
import Header from "./components/Header";
import UserProfile from "./components/UserProfile";

function App() {
  return (
    <>
      <Header />
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
       
        <UserProfile/>
        <BankButton/>
      </div>
      <Footer />
    </>
  );
}

export default App;

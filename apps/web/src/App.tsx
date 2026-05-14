import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import UserProfile from "./components/UserProfile";

function App() {
  return (
    <>
      <Header />
    <div className="flex min-h-screen items-center justify-center bg-primary-200">
       
        <UserProfile/>
      
      </div>
      <Footer />
    </>
  );
}

export default App;

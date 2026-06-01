import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Game from "./components/Game";
// import UserProfile from "./components/UserProfile";

function App() {
  return (
    <>
      <Header />
      <div className="flex flex-col min-h-screen items-center bg-primary-200 pt-16">
        {/* <UserProfile/> */}
        <Game />
      </div>
      <Footer />
    </>
  );
}

export default App;

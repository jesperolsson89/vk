import logo from "../assets/BankID_logo.png";

const BankButton = () => {
  return (
    <button className="flex items-center gap-3 font-semibold px-6 py-3 rounded-lg transition-colors duration-200 shadow-md cursor-pointer">
      <img src={logo} className="w-12 h-12 object-contain" />
      Logga in
    </button>
  );
};

export default BankButton;
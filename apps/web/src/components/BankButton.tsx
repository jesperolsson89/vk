import logo from "../assets/BankID_logo.png";

const BankButton = () => {
  return (
    <button className="flex bg-white items-center gap-2 font-semibold rounded-lg shadow-md cursor-pointer">
      <img src={logo} className="w-12 h-12 object-contain" />
      <p className="pr-4">Logga in</p>
    </button>
  );
};

export default BankButton;
import { useState } from "react";
import logo from "../assets/BankID_logo.png";
import BankIDModal from "./BankIDModal";

const BankButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex bg-white items-center gap-2 font-semibold rounded-lg cursor-pointer pr-3 shadow-xs border border-transparent hover:border-primary-900 transition-colors"
      >
        <img src={logo} className="w-12 h-12 object-contain ml-2" />
        <p className="pr-4 text-xl">Logga in</p>
      </button>

      {showModal && <BankIDModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default BankButton;
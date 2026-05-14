import { useState } from "react";
import logo from "../assets/BankID_logo.png";
import BankIDModal from "./BankIDModal";

interface Props {
  onLogin: (user: { givenName: string; name: string }) => void;
}

const BankButton = ({ onLogin }: Props) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex bg-white items-center gap-2 font-semibold rounded-lg shadow-md cursor-pointer"
      >
        <img src={logo} className="w-12 h-12 object-contain" />
        <p className="pr-4">Logga in</p>
      </button>

      {showModal && (
        <BankIDModal
          onClose={() => setShowModal(false)}
          onLogin={(user) => {
            onLogin(user);
            setShowModal(false);
          }}
        />
      )}
    </>
  );
};

export default BankButton;
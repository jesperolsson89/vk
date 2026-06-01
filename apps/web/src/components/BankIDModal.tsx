import { useState, useEffect, useRef } from "react";
import logo from "../assets/BankID_logo.png";
import BankIDQrCode from "./BankIDQrCode";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

type Step = "choose" | "same-device" | "other-device";

interface Props {
  onClose: () => void;
}

const BankIDModal = ({ onClose }: Props) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { setUser } = useUser();
  const [step, setStep] = useState<Step>("choose");
  const [orderRef, setOrderRef] = useState<string | null>(null);
  const [hint, setHint] = useState("");
  const [qrStartToken, setQrStartToken] = useState("");
  const [qrStartSecret, setQrStartSecret] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined,
  );
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  async function startAuth(sameDevice: boolean) {
    const res = await fetch(`${API_URL}/api/bankid/auth`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();

    setOrderRef(data.orderRef);
    setQrStartToken(data.qrStartToken);
    setQrStartSecret(data.qrStartSecret);
    setStep(sameDevice ? "same-device" : "other-device");

    if (sameDevice) {
      window.location.href = `bankid:///?autostarttoken=${data.autoStartToken}&redirect=null`;
    }
  }

  useEffect(() => {
    if (!orderRef) return;
    intervalRef.current = setInterval(async () => {
      const res = await fetch(`${API_URL}/api/bankid/collect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderRef }),
      });
      const result = await res.json();

      if (result.status === "complete") {
        clearInterval(intervalRef.current);
        setUser({
          givenName: result.completionData.user.givenName,
          name: result.completionData.user.name,
          surname: result.completionData.user.surname,
          personalNumber: result.completionData.user.personalNumber,
        });
        onClose();
        navigate("/");
      } else if (result.status === "failed") {
        clearInterval(intervalRef.current);
        setHint("Något gick fel. Försök igen.");
        setStep("choose");
      } else {
        const messages: Record<string, string> = {
          outstandingTransaction: "Starta BankID-appen.",
          userSign: "Skriv in din säkerhetskod i BankID-appen.",
          noClient: "BankID-appen verkar inte vara installerad.",
        };
        setHint(
          messages[result.hintCode] ?? "Följ instruktionerna i BankID-appen.",
        );
      }
    }, 2000);
    return () => clearInterval(intervalRef.current);
  }, [orderRef]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-[fadeIn_0.2s_ease]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-xl animate-[slideUp_0.2s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <img src={logo} className="h-16 object-contain" />
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 cursor-pointer text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Choose device */}
        {step === "choose" && (
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-neutral-800 mb-2">
              Logga in med BankID
            </h2>
            <button
              onClick={() => startAuth(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-medium transition-colors cursor-pointer"
            >
              BankID på den här enheten
            </button>
            <button
              onClick={() => startAuth(false)}
              className="border border-primary-600 text-primary-600 hover:bg-primary-50 py-3 rounded-xl font-medium transition-colors cursor-pointer"
            >
              BankID på en annan enhet
            </button>
          </div>
        )}

        {/* Same device — waiting */}
        {step === "same-device" && (
          <div className="text-center">
            <p className="text-neutral-600 mb-4">
              {hint || "Öppnar BankID-appen..."}
            </p>
            <button
              onClick={() => setStep("choose")}
              className="text-sm text-neutral-400 hover:text-neutral-600 cursor-pointer"
            >
              Avbryt
            </button>
          </div>
        )}

        {/* Other device — animated QR code */}
        {step === "other-device" && (
          <div className="text-center flex flex-col items-center gap-4">
            <p className="text-neutral-600">Skanna QR-koden med BankID-appen</p>
            <BankIDQrCode
              qrStartToken={qrStartToken}
              qrStartSecret={qrStartSecret}
              active={step === "other-device"}
            />
            <p className="text-sm text-neutral-500">{hint}</p>
            <button
              onClick={() => setStep("choose")}
              className="text-sm text-neutral-400 hover:text-neutral-600 cursor-pointer"
            >
              Avbryt
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BankIDModal;

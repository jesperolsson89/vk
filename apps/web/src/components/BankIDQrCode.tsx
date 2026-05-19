import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { useBankIDQr } from "../hooks/useBankIDQr";

interface Props {
  qrStartToken: string;
  qrStartSecret: string;
  active: boolean;
}

const BankIDQrCode = ({ qrStartToken, qrStartSecret, active }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fullscreenCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const qrData = useBankIDQr({ qrStartToken, qrStartSecret, active });

  useEffect(() => {
    if (!qrData) return;

    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, qrData, {
        width: 192,
        margin: 1,
        color: { dark: "#000000", light: "#ffffff" },
      });
    }

    if (fullscreenCanvasRef.current && isFullscreen) {
      QRCode.toCanvas(fullscreenCanvasRef.current, qrData, {
        width: 400,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
      });
    }
  }, [qrData, isFullscreen]);

  // Close fullscreen on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsFullscreen(true)}
        aria-label="QR-kod för BankID-inloggning. Klicka för att öppna i helskärm."
        className="rounded-xl overflow-hidden cursor-zoom-in hover:opacity-90 transition-opacity"
      >
        <canvas ref={canvasRef} />
      </button>

      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-[100] animate-[fadeIn_0.2s_ease]"
          onClick={() => setIsFullscreen(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 animate-[slideUp_0.2s_ease]"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-neutral-600 font-medium">Skanna med BankID-appen</p>
            <canvas ref={fullscreenCanvasRef} />
            <button
              onClick={() => setIsFullscreen(false)}
              className="text-sm text-neutral-400 hover:text-neutral-600 cursor-pointer"
            >
              Stäng
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BankIDQrCode;
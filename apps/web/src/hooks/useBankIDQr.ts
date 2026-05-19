import { useState, useEffect, useRef } from "react";

interface QrProps {
  qrStartToken: string;
  qrStartSecret: string;
  active: boolean; // only generate when on the other-device step
}

export function useBankIDQr({ qrStartToken, qrStartSecret, active }: QrProps) {
  const [qrData, setQrData] = useState<string>("");
  const startTime = useRef<number>(Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    if (!active || !qrStartToken || !qrStartSecret) return;

    startTime.current = Date.now();

    async function generateQr() {
      const seconds = Math.floor((Date.now() - startTime.current) / 1000);

      // Use Web Crypto API to generate HMAC-SHA256
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(qrStartSecret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );

      const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode(String(seconds))
      );

      // Convert to hex string
      const hmac = Array.from(new Uint8Array(signature))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      setQrData(`bankid.${qrStartToken}.${seconds}.${hmac}`);
    }

    generateQr();
    intervalRef.current = setInterval(generateQr, 1000);

    return () => clearInterval(intervalRef.current);
  }, [active, qrStartToken, qrStartSecret]);

  return qrData;
}
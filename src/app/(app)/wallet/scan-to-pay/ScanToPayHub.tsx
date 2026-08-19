"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { Card } from "@/components/ui";
import Avatar from "@/components/Avatar";
import { QrCode, Camera, Share, ChevronRight, Loader2 } from "@/components/Icons";
import { user, scanToPayContacts } from "@/lib/data";
import { encodeScanToPayPayload, decodeScanToPayPayload } from "@/lib/scanToPay";

type Tab = "code" | "scan";

export default function ScanToPayHub() {
  const [tab, setTab] = useState<Tab>("code");

  return (
    <div className="px-4 pb-6">
      <div className="flex rounded-xl bg-page p-1">
        {(
          [
            { id: "code" as const, label: "My Code", icon: QrCode },
            { id: "scan" as const, label: "Scan", icon: Camera },
          ]
        ).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-[13.5px] font-semibold transition-colors ${
              tab === id ? "bg-white text-brand shadow-sm" : "text-sub"
            }`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {tab === "code" ? <MyCodeTab /> : <ScanTab />}
    </div>
  );
}

function MyCodeTab() {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setFailed(false);
    QRCode.toDataURL(encodeScanToPayPayload(user.id), {
      width: 260,
      margin: 1,
      color: { dark: "#0f172a", light: "#ffffff" },
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch((err) => {
        console.error("Scan to Pay: failed to generate QR code", err);
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "FastGo Scan to Pay",
          text: `Send me money on FastGo — scan my code or search "${user.name}".`,
        });
      } catch {
        // user cancelled the share sheet — nothing to do
      }
    }
  };

  return (
    <div className="mt-5">
      <Card className="flex flex-col items-center gap-3 px-4 py-6">
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dataUrl} alt="Your FastGo Scan to Pay code" width={220} height={220} className="rounded-xl" />
        ) : failed ? (
          <div className="flex h-[220px] w-[220px] flex-col items-center justify-center gap-2 rounded-xl bg-page px-6 text-center text-faint">
            <QrCode size={32} />
            <span className="text-[11.5px]">Couldn&apos;t generate your code.</span>
            <button
              onClick={() => setAttempt((n) => n + 1)}
              className="rounded-lg bg-brand-soft px-3 py-1 text-[11.5px] font-semibold text-brand"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="flex h-[220px] w-[220px] items-center justify-center rounded-xl bg-page text-faint">
            <Loader2 size={28} className="animate-spin" />
          </div>
        )}
        <div className="flex items-center gap-2.5">
          <Avatar name={user.name} avatarUrl={user.avatarUrl} size={36} className="text-[12.5px]" />
          <span>
            <span className="block text-[14.5px] font-semibold">{user.name}</span>
            <span className="block text-[12px] text-sub">{user.phone}</span>
          </span>
        </div>
      </Card>

      <button
        onClick={share}
        className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-white py-3 text-[14px] font-semibold text-ink"
      >
        <Share size={16} /> Share My Code
      </button>

      <p className="mt-3 text-center text-[12px] text-faint">
        Anyone who scans this can send you money instantly, wallet to
        wallet. It never exposes your balance or transaction history.
      </p>
    </div>
  );
}

function ScanTab() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<"idle" | "starting" | "live" | "unsupported" | "denied">("idle");
  const [manualCode, setManualCode] = useState("");
  const [manualError, setManualError] = useState<string | null>(null);

  const resolveAndGo = (rawOrId: string) => {
    const id = decodeScanToPayPayload(rawOrId) ?? rawOrId.trim();
    const contact = scanToPayContacts.find(
      (c) => c.id === id || c.phone === id
    );
    if (!contact) {
      setManualError("We couldn't find a FastGo user with that code.");
      return false;
    }
    stopCamera();
    router.push(`/wallet/scan-to-pay/send?to=${contact.id}`);
    return true;
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  useEffect(() => {
    if (!("BarcodeDetector" in window) || !window.BarcodeDetector) {
      setStatus("unsupported");
      return;
    }

    let interval: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    (async () => {
      setStatus("starting");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setStatus("live");

        const detector = new window.BarcodeDetector!({ formats: ["qr_code"] });
        interval = setInterval(async () => {
          if (!videoRef.current) return;
          try {
            const codes = await detector.detect(videoRef.current);
            const hit = codes.find((c) => decodeScanToPayPayload(c.rawValue));
            if (hit) resolveAndGo(hit.rawValue);
          } catch {
            // a mid-frame decode failure just means try again next tick
          }
        }, 350);
      } catch {
        if (!cancelled) setStatus("denied");
      }
    })();

    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-5">
      {status === "live" || status === "starting" ? (
        <div className="relative overflow-hidden rounded-2xl bg-black">
          <video ref={videoRef} muted playsInline className="aspect-square w-full object-cover" />
          <div className="pointer-events-none absolute inset-8 rounded-2xl border-2 border-white/80" />
          {status === "starting" && (
            <div className="absolute inset-0 flex items-center justify-center text-[13px] font-medium text-white/80">
              Starting camera…
            </div>
          )}
        </div>
      ) : (
        <div className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-2xl bg-page text-center">
          <Camera size={32} className="text-faint" />
          <p className="px-8 text-[12.5px] text-sub">
            {status === "denied"
              ? "Camera access was denied. You can still enter a code manually below."
              : "Live camera scanning isn't available on this device. Enter a code manually below."}
          </p>
        </div>
      )}

      <div className="mt-4">
        <label className="mb-1.5 block text-[12.5px] font-semibold text-sub">
          Or enter a FastGo code / phone number
        </label>
        <div className="flex gap-2">
          <input
            value={manualCode}
            onChange={(e) => {
              setManualCode(e.target.value);
              setManualError(null);
            }}
            placeholder="+263 or fastgo:pay:…"
            className="flex-1 rounded-xl border border-line bg-white px-3.5 py-2.5 text-[13.5px] outline-none focus:border-brand"
          />
          <button
            onClick={() => manualCode.trim() && resolveAndGo(manualCode)}
            disabled={!manualCode.trim()}
            className="rounded-xl bg-brand px-4 text-[13.5px] font-semibold text-white disabled:opacity-40"
          >
            Go
          </button>
        </div>
        {manualError && <p className="mt-1.5 text-[12px] text-bad">{manualError}</p>}
      </div>

      <div className="mt-5">
        <div className="mb-2 text-[12.5px] font-semibold text-sub">Recent Contacts</div>
        <Card>
          {scanToPayContacts.map((c, i) => (
            <button
              key={c.id}
              onClick={() => resolveAndGo(c.id)}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left ${i > 0 ? "border-t border-line" : ""}`}
            >
              <Avatar name={c.name} avatarUrl={c.avatarUrl} size={34} className="text-[12px]" />
              <span className="flex-1">
                <span className="block text-[13.5px] font-medium">{c.name}</span>
                <span className="block text-[11.5px] capitalize text-sub">{c.role}</span>
              </span>
              <ChevronRight size={16} className="text-faint" />
            </button>
          ))}
        </Card>
      </div>
    </div>
  );
}

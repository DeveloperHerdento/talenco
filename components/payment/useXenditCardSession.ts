"use client";

import { useEffect, useRef, useState } from "react";
import type { XenditComponents as XenditComponentsType, XenditPaymentChannel } from "xendit-components-web";

export type CardSessionPhase = "idle" | "starting" | "card-form" | "submitting" | "confirming" | "error";

type ChargedAmount = { amount: number; currency: string };

type Options = {
  confirmPaid?: () => Promise<boolean>;
};

export function useXenditCardSession(onPaid: () => void, options: Options = {}) {
  const { confirmPaid } = options;
  const [phase, setPhase] = useState<CardSessionPhase>("idle");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [chargedAmount, setChargedAmount] = useState<ChargedAmount | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const componentsRef = useRef<XenditComponentsType | null>(null);
  const channelElRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    return () => {
      if (channelElRef.current) componentsRef.current?.destroyComponent?.(channelElRef.current);
    };
  }, []);

  const start = async (createSession: () => Promise<Response>) => {
    setPhase("starting");
    setError("");

    try {
      const res = await createSession();
      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "決済セッションの作成に失敗しました。/ Failed to start payment.");
        setPhase("idle");
        return;
      }

      setChargedAmount({ amount: json.amount, currency: json.currency });

      const { XenditComponents } = await import("xendit-components-web");
      const components = new XenditComponents({ componentsSdkKey: json.componentsSdkKey });
      componentsRef.current = components;

      const handleInit = () => {
        const cardChannel = components.getActiveChannels({ filter: "CARDS" })[0] as XenditPaymentChannel | undefined;
        if (!cardChannel || !containerRef.current) {
          setError("クレジットカード決済が現在ご利用いただけません。/ Card payment is not available right now.");
          setPhase("error");
          return;
        }
        const el = components.createChannelComponent(cardChannel);
        channelElRef.current = el;
        containerRef.current.replaceChildren(el);
        setPhase("card-form");
      };

      const handleReady = () => setReady(true);
      const handleNotReady = () => setReady(false);
      const handleComplete = async () => {
        if (!confirmPaid) {
          onPaid();
          return;
        }
        setPhase("confirming");
        const confirmed = await confirmPaid();
        if (confirmed) {
          onPaid();
        } else {
          setError(
            "決済の確認に時間がかかっています。しばらくしてから登録状況ページでご確認ください。/ Payment confirmation is taking longer than expected. Please check your status page shortly."
          );
          setPhase("card-form");
        }
      };
      const handleExpiredOrCanceled = () => {
        setError("決済セッションの有効期限が切れました。もう一度お試しください。/ The payment session expired. Please try again.");
        setPhase("idle");
      };
      const handleFatalError = () => {
        setError("決済処理中にエラーが発生しました。/ Something went wrong during payment.");
        setPhase("card-form");
      };

      components.addEventListener("init", handleInit);
      components.addEventListener("submission-ready", handleReady);
      components.addEventListener("submission-not-ready", handleNotReady);
      components.addEventListener("session-complete", handleComplete);
      components.addEventListener("session-expired-or-canceled", handleExpiredOrCanceled);
      components.addEventListener("fatal-error", handleFatalError);
    } catch {
      setError("ネットワークエラーが発生しました。再度お試しください。/ Network error. Please try again.");
      setPhase("idle");
    }
  };

  const pay = () => {
    setPhase("submitting");
    componentsRef.current?.submit();
  };

  return { phase, error, ready, chargedAmount, containerRef, start, pay };
}

export type CashfreeMode = "sandbox" | "production";

export type CashfreeCheckoutResult = {
  error?: {
    message?: string;
    code?: string;
    type?: string;
  };
  redirect?: boolean;
  paymentDetails?: {
    paymentMessage?: string;
  };
};

export type CashfreeInstance = {
  checkout: (options: {
    paymentSessionId: string;
    redirectTarget?: "_self" | "_blank" | "_top" | "_modal" | string;
  }) => Promise<CashfreeCheckoutResult>;
  version?: () => string;
};

declare global {
  interface Window {
    Cashfree?: (options: { mode: CashfreeMode }) => CashfreeInstance;
  }
}

let cashfreeScriptPromise: Promise<boolean> | null = null;

export function loadCashfreeScript() {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  if (window.Cashfree) {
    return Promise.resolve(true);
  }

  if (!cashfreeScriptPromise) {
    cashfreeScriptPromise = new Promise((resolve) => {
      const existing = document.querySelector<HTMLScriptElement>('script[data-cashfree-sdk="true"]');
      if (existing) {
        existing.addEventListener("load", () => resolve(Boolean(window.Cashfree)), { once: true });
        existing.addEventListener("error", () => resolve(false), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      script.async = true;
      script.dataset.cashfreeSdk = "true";
      script.onload = () => resolve(Boolean(window.Cashfree));
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  return cashfreeScriptPromise;
}

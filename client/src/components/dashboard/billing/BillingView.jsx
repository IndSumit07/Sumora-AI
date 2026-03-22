import React, { useState, useEffect, useCallback } from "react";
import { CreditCard, Check, Zap, Loader2, AlertCircle } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";
import PRICING_PLANS from "../../../shared/pricing.json";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  withCredentials: true,
});

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const RefundTimer = ({ updatedAt, onTimeout }) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const txTime = new Date(updatedAt).getTime();
    const endTime = txTime + 60 * 1000; // 1 minute
    return Math.max(0, Math.floor((endTime - Date.now()) / 1000));
  });

  useEffect(() => {
    // Start interval
    const timer = setInterval(() => {
      const txTime = new Date(updatedAt).getTime();
      const endTime = txTime + 60 * 1000;
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));

      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        if (onTimeout) onTimeout();
      }
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedAt]);

  if (timeLeft <= 0) return null;

  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;

  return (
    <span className="text-xs font-mono text-[#ea580c] ml-2">
      ({m}:{s.toString().padStart(2, "0")})
    </span>
  );
};

const BillingView = () => {
  const { user, setUser } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [tokens, setTokens] = useState(user?.tokens || 0);
  const [transactions, setTransactions] = useState([]);
  const [fetching, setFetching] = useState(true);

  const fetchTokenData = useCallback(async () => {
    try {
      const res = await api.get("/api/payment/tokens");
      if (res.data.success) {
        setTokens(res.data.tokens);
        setTransactions(res.data.transactions);
        if (user) {
          setUser({ ...user, tokens: res.data.tokens });
        }
      }
    } catch (error) {
      console.error("Failed to fetch tokens", error);
    } finally {
      setFetching(false);
    }
  }, [user, setUser]);

  useEffect(() => {
    fetchTokenData();
  }, [fetchTokenData]);

  const handlePurchase = async (planId) => {
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }

    setLoadingPlan(planId);
    try {
      // 1. Create order
      const orderRes = await api.post("/api/payment/create-order", { planId });
      const { orderId, amount, currency, keyId } = orderRes.data.data;

      // 2. Initialize Razorpay
      const options = {
        key: keyId,
        amount: amount.toString(),
        currency: currency,
        name: "Sumora AI",
        description: "Token Purchase",
        order_id: orderId,
        handler: async function (response) {
          try {
            // 3. Verify payment
            const verifyRes = await api.post("/api/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              setTokens(verifyRes.data.tokens);
              fetchTokenData(); // to get fresh history
              toast.success("Payment successful! Tokens added.");
            }
          } catch (err) {
            console.error("Payment Error:", err);
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: user?.username || "Guest",
          email: user?.email || "guest@example.com",
        },
        theme: {
          color: "#ea580c",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      paymentObject.on("payment.failed", function (response) {
        toast.error("Payment Failed. Reason: " + response.error.description);
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to initiate payment");
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleRefund = async (transactionId) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-white">
            Are you sure you want to refund this transaction?
          </p>
          <p className="text-xs text-gray-300">
            You will immediately lose the tokens associated with it.
          </p>
          <div className="flex gap-2 justify-end">
            <button
              className="px-3 py-1.5 text-xs font-medium bg-[#2a2a2a] hover:bg-[#333] text-gray-200 rounded-md transition-colors"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1.5 text-xs font-medium bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
              onClick={async () => {
                toast.dismiss(t.id);
                const toastId = toast.loading("Processing your refund...");
                try {
                  const res = await api.post("/api/payment/refund", {
                    transactionId,
                  });
                  if (res.data.success) {
                    toast.success("Refund successful. Tokens removed.", {
                      id: toastId,
                    });
                    fetchTokenData();
                  }
                } catch (error) {
                  toast.error(
                    error?.response?.data?.message || "Refund failed.",
                    { id: toastId },
                  );
                }
              }}
            >
              Confirm Refund
            </button>
          </div>
        </div>
      ),
      {
        duration: 10000,
        style: {
          minWidth: "300px",
        },
      },
    );
  };

  const canRefund = (dateString, status) => {
    if (status !== "success") return false;
    const txTime = new Date(dateString).getTime();
    const now = Date.now();
    return now - txTime <= 1 * 60 * 1000; // 1 minute from the time it succeeded
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full flex flex-col gap-8 pb-32">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <CreditCard className="text-[#ea580c]" />
          Billing & Tokens
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your tokens, purchases, and billing history.
        </p>
      </div>

      {/* Balance Card */}
      <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Current Balance
          </p>
          <div className="text-4xl font-bold mt-1 tracking-tight flex items-baseline gap-2 text-gray-900 dark:text-white">
            {fetching ? (
              <Loader2 className="animate-spin w-6 h-6 text-gray-400" />
            ) : (
              tokens
            )}
            <span className="text-sm text-gray-400 font-normal">Tokens</span>
          </div>
        </div>
        <div className="h-12 w-12 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
          <Zap className="text-[#ea580c]" size={24} />
        </div>
      </div>

      {/* Pricing Plans */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Buy Tokens
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Plan 1 */}
          <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-white/10 rounded-2xl p-6 hover:border-[#ea580c] transition-colors relative">
            <div className="absolute top-4 right-4 bg-orange-100 text-[#ea580c] text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              Popular
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {PRICING_PLANS.starter.name}
            </h3>
            <div className="mt-4 flex items-baseline text-4xl font-extrabold text-gray-900 dark:text-white">
              ₹{PRICING_PLANS.starter.price}
              <span className="ml-2 text-lg font-medium text-gray-400 line-through">
                ₹{PRICING_PLANS.starter.originalPrice}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Get {PRICING_PLANS.starter.tokens} AI generation tokens.
            </p>
            <ul className="mt-6 space-y-3">
              {PRICING_PLANS.starter.features.map((feature, idx) => (
                <li
                  key={idx}
                  className="flex gap-3 text-sm text-gray-600 dark:text-gray-300"
                >
                  <Check className="text-[#ea580c] shrink-0" size={18} />
                  {feature.text}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handlePurchase(PRICING_PLANS.starter.id)}
              disabled={loadingPlan === PRICING_PLANS.starter.id}
              className="mt-8 w-full bg-[#ea580c] hover:bg-[#d24e0b] text-white py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loadingPlan === PRICING_PLANS.starter.id ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                `Purchase ${PRICING_PLANS.starter.tokens} Tokens`
              )}
            </button>
          </div>

          {/* Plan 2 */}
          <div className="bg-white dark:bg-[#161616] border border-[#ea580c] shadow-[0_0_15px_rgba(234,88,12,0.1)] rounded-2xl p-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ea580c] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Best Value
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {PRICING_PLANS.pro.name}
            </h3>
            <div className="mt-4 flex items-baseline text-4xl font-extrabold text-gray-900 dark:text-white">
              ₹{PRICING_PLANS.pro.price}
              <span className="ml-2 text-lg font-medium text-gray-400 line-through">
                ₹{PRICING_PLANS.pro.originalPrice}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Get {PRICING_PLANS.pro.tokens} AI generation tokens.
            </p>
            <ul className="mt-6 space-y-3">
              {PRICING_PLANS.pro.features.map((feature, idx) => (
                <li
                  key={idx}
                  className="flex gap-3 text-sm text-gray-600 dark:text-gray-300"
                >
                  <Check className="text-[#ea580c] shrink-0" size={18} />
                  {feature.text}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handlePurchase(PRICING_PLANS.pro.id)}
              disabled={loadingPlan === PRICING_PLANS.pro.id}
              className="mt-8 w-full bg-[#ea580c] hover:bg-[#d24e0b] text-white py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loadingPlan === PRICING_PLANS.pro.id ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                `Purchase ${PRICING_PLANS.pro.tokens} Tokens`
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Purchase History
        </h2>
        <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden">
          {fetching ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="animate-spin text-gray-400" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500 flex flex-col items-center gap-2">
              <AlertCircle size={24} className="opacity-50" />
              <p>No transactions yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {transactions.map((tx) => (
                <div
                  key={tx._id}
                  className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {tx.tokensAdded} Tokens Pack
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(tx.createdAt).toLocaleDateString()} at{" "}
                      {new Date(tx.createdAt).toLocaleTimeString()}
                    </p>
                    <p className="text-xs font-mono text-gray-400 mt-0.5">
                      Order: {tx.razorpay_order_id}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/2">
                    <div className="flex flex-col items-end">
                      <span className="font-medium text-gray-900 dark:text-white">
                        ₹{tx.amount}
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-md mt-1
                        ${
                          tx.status === "success"
                            ? "bg-green-100 text-green-700 dark:bg-green-500/10"
                            : tx.status === "refunded"
                              ? "bg-gray-100 text-gray-600 dark:bg-white/10"
                              : "bg-red-100 text-red-700 dark:bg-red-500/10"
                        }`}
                      >
                        {tx.status.toUpperCase()}
                      </span>
                    </div>

                    {canRefund(tx.updatedAt, tx.status) &&
                      tokens >= tx.tokensAdded && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRefund(tx._id)}
                            className="text-xs font-medium text-red-500 hover:text-red-600 underline underline-offset-2"
                          >
                            Refund
                          </button>
                          <RefundTimer
                            updatedAt={tx.updatedAt}
                            onTimeout={() =>
                              setTransactions((prev) => [...prev])
                            }
                          />
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingView;

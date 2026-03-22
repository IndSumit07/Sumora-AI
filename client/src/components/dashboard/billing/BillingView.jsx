import React, { useState, useEffect, useCallback } from "react";
import { CreditCard, Check, Zap, Loader2, AlertCircle } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "", // falls back to relative /api
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
    return now - txTime <= 10 * 60 * 1000; // 10 minutes
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
              Starter Pack
            </h3>
            <div className="mt-4 flex items-baseline text-4xl font-extrabold text-gray-900 dark:text-white">
              ₹9
              <span className="ml-2 text-lg font-medium text-gray-400 line-through">
                ₹49
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Get 100 AI generation tokens.
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex gap-3 text-sm text-gray-600 dark:text-gray-300">
                <Check className="text-[#ea580c] shrink-0" size={18} /> Limited
                time 80% discount
              </li>
              <li className="flex gap-3 text-sm text-gray-600 dark:text-gray-300">
                <Check className="text-[#ea580c] shrink-0" size={18} /> Valid
                for all AI functionalities
              </li>
            </ul>
            <button
              onClick={() => handlePurchase("plan_100")}
              disabled={loadingPlan === "plan_100"}
              className="mt-8 w-full bg-[#ea580c] hover:bg-[#d24e0b] text-white py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loadingPlan === "plan_100" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Purchase 100 Tokens"
              )}
            </button>
          </div>

          {/* Plan 2 */}
          <div className="bg-white dark:bg-[#161616] border border-[#ea580c] shadow-[0_0_15px_rgba(234,88,12,0.1)] rounded-2xl p-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ea580c] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Best Value
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Pro Pack
            </h3>
            <div className="mt-4 flex items-baseline text-4xl font-extrabold text-gray-900 dark:text-white">
              ₹59
              <span className="ml-2 text-lg font-medium text-gray-400 line-through">
                ₹99
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Bulk pack of 1000 AI generation tokens.
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex gap-3 text-sm text-gray-600 dark:text-gray-300">
                <Check className="text-[#ea580c] shrink-0" size={18} /> Amazing
                value for pros
              </li>
              <li className="flex gap-3 text-sm text-gray-600 dark:text-gray-300">
                <Check className="text-[#ea580c] shrink-0" size={18} /> Premium
                priority processing
              </li>
            </ul>
            <button
              onClick={() => handlePurchase("plan_1000")}
              disabled={loadingPlan === "plan_1000"}
              className="mt-8 w-full bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loadingPlan === "plan_1000" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Purchase 1000 Tokens"
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

                    {canRefund(tx.createdAt, tx.status) &&
                      tokens >= tx.tokensAdded && (
                        <button
                          onClick={() => handleRefund(tx._id)}
                          className="text-xs font-medium text-red-500 hover:text-red-600 underline underline-offset-2"
                        >
                          Refund
                        </button>
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

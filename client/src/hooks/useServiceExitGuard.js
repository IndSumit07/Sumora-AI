import { useCallback, useEffect, useRef, useState } from "react";
import { useBlocker } from "react-router-dom";

export default function useServiceExitGuard({ when, onConfirmExit }) {
  const blocker = useBlocker(when);
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const pendingActionRef = useRef(null);
  const pendingSourceRef = useRef("none"); // "route" | "action" | "none"

  useEffect(() => {
    if (blocker.state === "blocked") {
      pendingSourceRef.current = "route";
      setIsOpen(true);
    }
  }, [blocker.state]);

  useEffect(() => {
    if (!when) return;

    const beforeUnloadHandler = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, [when]);

  const requestExit = useCallback(
    (action) => {
      if (!when) {
        action?.();
        return true;
      }

      pendingActionRef.current = action || null;
      pendingSourceRef.current = "action";
      setIsOpen(true);
      return false;
    },
    [when],
  );

  const cancelExit = useCallback(() => {
    const source = pendingSourceRef.current;

    pendingSourceRef.current = "none";
    pendingActionRef.current = null;
    setIsOpen(false);

    if (source === "route" && blocker.state === "blocked") {
      blocker.reset();
    }
  }, [blocker]);

  const confirmExit = useCallback(async () => {
    if (isConfirming) return;

    const source = pendingSourceRef.current;
    const pendingAction = pendingActionRef.current;

    setIsConfirming(true);
    let shouldProceedRoute = false;
    try {
      if (onConfirmExit) {
        await onConfirmExit();
      }
    } finally {
      pendingSourceRef.current = "none";
      pendingActionRef.current = null;
      setIsOpen(false);
      setIsConfirming(false);

      if (source === "route") {
        shouldProceedRoute = true;
      }
    }

    if (shouldProceedRoute) {
      if (blocker.state === "blocked") {
        blocker.proceed();
      }
      return;
    }

    pendingAction?.();
  }, [blocker, isConfirming, onConfirmExit]);

  return {
    isOpen,
    isConfirming,
    requestExit,
    confirmExit,
    cancelExit,
  };
}

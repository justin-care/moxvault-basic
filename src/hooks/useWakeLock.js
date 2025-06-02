import { useEffect, useRef } from "react";

const useWakeLock = (active = true) => {
  const wakeLockRef = useRef(null);

  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ("wakeLock" in navigator && active) {
          wakeLockRef.current = await navigator.wakeLock.request("screen");
          console.log("Wake lock activated.");

          // Re-apply lock if it's released (e.g. when screen dims)
          wakeLockRef.current.addEventListener("release", () => {
            console.log("Wake lock released.");
          });

          // Optional: Re-request on tab visibility change
          document.addEventListener("visibilitychange", async () => {
            if (document.visibilityState === "visible" && active) {
              wakeLockRef.current = await navigator.wakeLock.request("screen");
              console.log("Wake lock re-activated.");
            }
          });
        }
      } catch (err) {
        console.error("Wake lock error:", err);
      }
    };

    requestWakeLock();

    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
        console.log("Wake lock manually released.");
      }
    };
  }, [active]);
};

export default useWakeLock;

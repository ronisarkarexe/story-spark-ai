"use client";
import React, { useEffect, useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

const BottomAd = () => {
  const [isClient, setIsClient] = useState(false);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    setIsClient(true);

    if (typeof window !== "undefined") {
      // Load AdSense script once
      const scriptId = "adsbygoogle-js";
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.async = true;
        script.src =
          "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4311738896428559";
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
      }
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.warn("AdSense error:", e);
      }
    }
  }, [isClient]);

  if (!isClient) return null;

  // Detect environment for test ads
  const isDev =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        background: "#fff",
        boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
        zIndex: 9999,
        transition: "height 0.3s ease",
        height: minimized ? "36px" : "120px",
        overflow: "hidden",
        textAlign: "center",
        padding: minimized ? "0" : "4px 0",
      }}
    >
      <button
        onClick={() => setMinimized(!minimized)}
        style={{
          position: "absolute",
          right: "8px",
          top: "4px",
          background: "transparent",
          border: "none",
          fontSize: "16px",
          cursor: "pointer",
          color: "#444",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label={minimized ? "Expand Ad" : "Minimize Ad"}
      >
        {minimized ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {minimized ? (
        <div style={{ fontSize: "13px", padding: "6px", color: "#555" }}>
          Ad minimized — click ▲ to reopen
        </div>
      ) : (
        <ins
          className="adsbygoogle"
          style={{ display: "inline-block", width: "728px", height: "90px" }}
          data-ad-client="ca-pub-4311738896428559"
          data-ad-slot="3858222679"
        ></ins>
      )}
    </div>
  );
};

export default BottomAd;
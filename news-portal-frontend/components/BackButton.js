// components/BackButton.js
import Link from "next/link";

export default function BackButton({ href = "/", label = "← Kembali" }) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "8px 16px",
        backgroundColor: "#1e293b", // slate-800
        color: "white",
        textDecoration: "none",
        borderRadius: "50px",
        fontSize: "14px",
        border: "1px solid rgba(255,255,255,0.15)",
        transition: "all 0.2s ease",
        boxShadow: "0 2px 10px rgba(0,0,0,0.25)"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#2563eb";
        e.currentTarget.style.boxShadow =
          "0 4px 14px rgba(37,99,235,0.45)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#1e293b";
        e.currentTarget.style.boxShadow =
          "0 2px 10px rgba(0,0,0,0.25)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
      }}
    >
      {label}
    </Link>
  );
}

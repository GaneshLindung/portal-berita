// pages/trending.js
import { useEffect, useState } from "react";
import Link from "next/link";
import BackButton from "../components/BackButton";
import { useTheme } from "../components/ThemeContext";
import { API_BASE_URL } from "../lib/api";

export default function Trending() {
  const { theme } = useTheme();
  const [range, setRange] = useState("day");
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/trending/${range}`)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch(console.error);
  }, [range]);

  const headerHeight = 110;

  return (
    <div
      style={{
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        backgroundColor: theme.pageBg,
        color: theme.pageText,
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          background: theme.headerBg,
          color: "white",
          padding: "16px 0",
          boxShadow: "0 3px 12px rgba(0,0,0,0.4)",
          position: "fixed",
          top: 0,
          zIndex: 20,
          width: "100%",
          left: 0,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* TITLE */}
          <div>
            <h1 style={{ fontSize: 26, fontWeight: "bold", margin: 0 }}>
              🔥 Trending Berita
            </h1>
            <p
              style={{
                fontSize: 12,
                color: theme.headerSubText,
                marginTop: 4,
              }}
            >
              Top 5 berita paling banyak dibaca
            </p>
          </div>

          {/* TOMBOL KEMBALI */}
          <BackButton href="/" label="← Kembali ke Beranda" />
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: `${headerHeight + 16}px 16px 40px 16px`,
        }}
      >
        {/* TAB FILTER */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 24,
            justifyContent: "center",
          }}
        >
          {[
            { id: "day", label: "Hari ini" },
            { id: "week", label: "Mingguan" },
            { id: "month", label: "Bulanan" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRange(tab.id)}
              style={{
                padding: "8px 16px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                backgroundColor:
                  range === tab.id ? "#2563eb" : "rgba(0,0,0,0.06)",
                color: range === tab.id ? "white" : "#334155",
                fontWeight: 600,
                transition: "0.2s",
                boxShadow:
                  range === tab.id
                    ? "0 6px 14px rgba(37,99,235,0.35)"
                    : "none",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* LIST TRENDING */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
            marginBottom: 40,
          }}
        >
          {items.map((a, index) => (
            <article
              key={a.id}
              style={{
                backgroundColor: "white",
                borderRadius: 14,
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                display: "flex",
                flexDirection: "column",
                transition: "0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 24px rgba(0,0,0,0.18)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0,0,0,0.08)";
              }}
            >
              <img
                src={a.thumbnail_url}
                style={{
                  width: "100%",
                  height: 150,
                  objectFit: "cover",
                }}
              />

              <div style={{ padding: 14 }}>
                <span
                  style={{
                    display: "inline-block",
                    backgroundColor: "#eef2ff",
                    color: "#4f46e5",
                    padding: "4px 10px",
                    borderRadius: 50,
                    fontSize: 11,
                    fontWeight: 600,
                    marginBottom: 6,
                  }}
                >
                  #{index + 1} • {a.category}
                </span>

                <h2
                  style={{
                    fontSize: 17,
                    margin: "6px 0",
                    fontWeight: 600,
                    color: "#0f172a",
                    lineHeight: 1.3,
                  }}
                >
                  <Link
                    href={`/article/${a.slug}`}
                    style={{ textDecoration: "none", color: "#0f172a" }}
                  >
                    {a.title}
                  </Link>
                </h2>

                <p style={{ fontSize: 13, color: "#64748b" }}>
                  {a.excerpt}
                </p>

                <p
                  style={{
                    fontSize: 12,
                    marginTop: 6,
                    color: "#94a3b8",
                  }}
                >
                  👁 {a.views}x dilihat
                </p>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
// pages/trending.js
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import BackButton from "../components/BackButton";
import { useTheme } from "../components/ThemeContext";
import { safeFetchJson } from "../lib/api";

const FALLBACK_ITEMS = [
  {
    id: "placeholder-1",
    title: "Trending belum tersedia",
    slug: "#",
    thumbnail_url: "",
    views: 0,
    excerpt:
      "Kami tidak dapat memuat data trending saat ini.",
    category: "Info",
  },
];

const CARD_BACKGROUNDS = [
  "linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)",
  "linear-gradient(135deg, #fef9c3 0%, #fef3c7 100%)",
  "linear-gradient(135deg, #ecfccb 0%, #d9f99d 100%)",
  "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)",
];

const RANGE_OPTIONS = [
  { id: "day", label: "Hari ini" },
  { id: "week", label: "Mingguan" },
  { id: "month", label: "Bulanan" },
];

export default function Trending() {
  const { theme } = useTheme();
  const [range, setRange] = useState("day");
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadTrending = async () => {
      setError("");
      setLoading(true);

      const data = await safeFetchJson(
        `/api/trending/${range}`,
        FALLBACK_ITEMS
      );

      if (!isMounted) return;

      const isArrayResponse = Array.isArray(data);
      const isFallback = data === FALLBACK_ITEMS;

      if (isArrayResponse && data.length > 0) {
        setItems(data);
      } else {
        setItems([]);
        setError(
          isFallback
            ? "Gagal memuat data trending. Pastikan backend berjalan dan koneksi API sesuai."
            : "Belum ada data trending untuk rentang ini."
        );
      }

      setLoading(false);
    };

    loadTrending();

    return () => {
      isMounted = false;
    };
  }, [range]);

  const statusText = useMemo(() => {
    if (loading) return "Sedang memuat...";
    if (error) return error;
    return "";
  }, [error, loading]);

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
          {RANGE_OPTIONS.map((tab) => (
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

        {statusText && (
          <div
            style={{
              backgroundColor: error ? "#fef2f2" : "#eff6ff",
              color: error ? "#b91c1c" : "#1d4ed8",
              padding: "12px 16px",
              borderRadius: 10,
              marginBottom: 16,
              border: error ? "1px solid #fecdd3" : "1px solid #bfdbfe",
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span aria-hidden>{loading ? "⏳" : error ? "⚠️" : "ℹ️"}</span>
            <span>{statusText}</span>
          </div>
        )}

        {/* LIST TRENDING */}
        {items.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
              marginBottom: 40,
              opacity: loading ? 0.5 : 1,
              transition: "opacity 0.2s ease",
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
                <div
                  aria-hidden
                  style={{
                    background: CARD_BACKGROUNDS[index % CARD_BACKGROUNDS.length],
                    height: 110,
                    borderBottom: "1px solid #e2e8f0",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    color: "#0f172a",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                      fontWeight: 700,
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: "rgba(15, 23, 42, 0.08)",
                        padding: "6px 12px",
                        borderRadius: 9999,
                        fontSize: 12,
                      }}
                    >
                      #{index + 1}
                    </span>
                  </div>

                  <span style={{ fontSize: 12, opacity: 0.8 }}>
                    👁 {a.views}x dilihat
                  </span>
                </div>

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
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
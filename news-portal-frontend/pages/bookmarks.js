// pages/bookmarks.js
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "../components/ThemeContext";
import BackButton from "../components/BackButton";

const STORAGE_KEY = "portal_berita_bookmarks";

export default function BookmarksPage() {
  const { theme } = useTheme();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setItems(list);
    } catch {
      setItems([]);
    }
  }, []);

  function removeOne(id) {
    const updated = items.filter((a) => a.id !== id);
    setItems(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  }

  function clearAll() {
    if (!confirm("Hapus semua bookmark?")) return;
    setItems([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

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
          padding: "14px 0",
          boxShadow: "0 3px 12px rgba(0,0,0,0.4)",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h1 style={{ fontSize: 24, fontWeight: "bold", margin: 0 }}>
              ★ Bookmark Saya
            </h1>
            <p
              style={{
                fontSize: 12,
                color: theme.headerSubText,
                marginTop: 4,
              }}
            >
              Kumpulan berita yang kamu simpan
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {items.length > 0 && (
              <button
                onClick={clearAll}
                style={{
                  fontSize: 12,
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: "1px solid #ef4444",
                  backgroundColor: "transparent",
                  color: "#fecaca",
                  cursor: "pointer",
                }}
              >
                Hapus Semua
              </button>
            )}
            <BackButton href="/" label="← Kembali ke Beranda" />
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 16px 32px 16px",
        }}
      >
        {items.length === 0 ? (
          <p style={{ fontSize: 14, color: "#6b7280" }}>
            Belum ada berita yang disimpan.  
            Buka salah satu berita lalu tekan tombol <b>“Simpan”</b>.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {items.map((article) => (
              <article
                key={article.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {article.thumbnail_url && (
                  <img
                    src={article.thumbnail_url}
                    alt={article.title}
                    style={{
                      width: "100%",
                      height: 150,
                      objectFit: "cover",
                    }}
                  />
                )}
                <div style={{ padding: "10px 12px 12px 12px" }}>
                  <span
                    style={{
                      fontSize: 11,
                      textTransform: "uppercase",
                      color: "#6b7280",
                    }}
                  >
                    {article.category}
                  </span>

                  <h2
                    style={{
                      fontSize: 16,
                      margin: "4px 0 6px 0",
                      color: "#111827",
                    }}
                  >
                    <Link
                      href={`/article/${article.slug}`}
                      style={{
                        textDecoration: "none",
                        color: "#111827",
                      }}
                    >
                      {article.title}
                    </Link>
                  </h2>

                  {article.excerpt && (
                    <p
                      style={{
                        fontSize: 13,
                        color: "#6b7280",
                        marginBottom: 8,
                      }}
                    >
                      {article.excerpt}
                    </p>
                  )}

                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 11,
                      color: "#9ca3af",
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 8,
                    }}
                  >
                    <span>
                      {article.created_at &&
                        new Date(article.created_at).toLocaleDateString(
                          "id-ID",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                    </span>
                    <button
                      onClick={() => removeOne(article.id)}
                      style={{
                        border: "none",
                        background: "transparent",
                        color: "#ef4444",
                        cursor: "pointer",
                        fontSize: 11,
                      }}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

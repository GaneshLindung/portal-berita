// pages/search.js
import Link from "next/link";
import BackButton from "../components/BackButton";
import { useTheme } from "../components/ThemeContext";

export async function getServerSideProps(context) {
  const { q = "" } = context.query;
  const baseUrl = "http://localhost:4000";

  if (!q) {
    return { props: { q: "", articles: [] } };
  }

  const res = await fetch(
    `${baseUrl}/api/articles?q=${encodeURIComponent(q)}&limit=20`
  );
  const articles = await res.json();

  return { props: { q, articles } };
}

export default function SearchPage({ q, articles }) {
  const { theme } = useTheme();
  const hasQuery = Boolean(q?.trim());
  const totalResults = hasQuery ? articles.length : 0;

  const headerHeight = 110;

  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
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
          boxShadow: "0 3px 12px rgba(0,0,0,0.5)",
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
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* LOGO & INFO */}
          <Link
            href="/"
            style={{
              textDecoration: "none",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <img
              src="/images/logo.png"
              alt="Portal Berita"
              style={{
                height: 36,
                width: 36,
                objectFit: "contain",
              }}
            />
            <div>
              <div style={{ fontSize: 20, fontWeight: "bold" }}>
                Portal Berita
              </div>
              <div
                style={{ fontSize: 11, color: theme.headerSubText }}
              >
                Pencarian Berita{hasQuery ? `: "${q}"` : ""}
              </div>
            </div>
          </Link>

          {/* TOMBOL KEMBALI */}
          <BackButton href="/" label="← Kembali ke Beranda" />
        </div>
      </header>

      {/* KONTEN */}
      <main
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: `${headerHeight + 10}px 16px 32px 16px`,
        }}
      >
        <h1
          style={{
            fontSize: 22,
            fontWeight: 600,
            marginBottom: 16,
            borderLeft: "4px solid #2563eb",
            paddingLeft: 8,
          }}
        >
          Pencarian Berita
        </h1>

        <div
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            border: "1px solid #e5e7eb",
            marginBottom: 18,
          }}
        >
          <form
            action="/search"
            method="get"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 12,
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Cari judul atau topik..."
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                fontSize: 14,
                backgroundColor: "#f8fafc",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "12px 18px",
                background: "linear-gradient(135deg, #2563eb, #16a34a)",
                color: "white",
                border: "none",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 10px 25px rgba(37,99,235,0.25)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Cari"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>

          <p
            style={{
              fontSize: 13,
              color: "#6b7280",
              margin: 0,
            }}
          >
            {hasQuery
              ? `Menampilkan ${totalResults} hasil untuk "${q}"`
              : "Masukkan kata kunci di atas untuk mulai mencari."}
          </p>
        </div>

        {!hasQuery && (
          <div
            style={{
              backgroundColor: "#f8fafc",
              border: "1px dashed #e5e7eb",
              borderRadius: 12,
              padding: 18,
              textAlign: "center",
              color: "#6b7280",
              fontSize: 14,
            }}
          >
            Mulai dengan mengetikkan kata kunci. Kami akan menampilkan berita
            yang relevan secara instan.
          </div>
        )}

        {hasQuery && totalResults === 0 && (
          <div
            style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecdd3",
              borderRadius: 12,
              padding: 18,
              textAlign: "center",
              color: "#b91c1c",
              fontSize: 14,
            }}
          >
            Tidak ada berita yang cocok dengan pencarian Anda. Coba kata kunci
            lain.
          </div>
        )}

        {hasQuery && totalResults > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 16,
              marginTop: 12,
            }}
          >
            {articles.map((article) => (
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
                <div style={{ padding: "10px 12px 12px 12px", flex: 1 }}>
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
                      style={{ textDecoration: "none", color: "#111827" }}
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
                      fontSize: 11,
                      color: "#9ca3af",
                    }}
                  >
                    {new Date(article.created_at).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                    {" • "}
                    {article.views}x dilihat
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
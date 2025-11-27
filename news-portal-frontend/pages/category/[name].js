// pages/category/[name].js
import Link from "next/link";
import BackButton from "../../components/BackButton";
import { useTheme } from "../../components/ThemeContext";

export async function getServerSideProps(context) {
  const { name } = context.params;

  const res = await fetch(
    `http://localhost:4000/api/articles?category=${encodeURIComponent(
      name
    )}&limit=20`
  );

  const articles = await res.json();

  return {
    props: {
      name,
      articles,
    },
  };
}

export default function CategoryPage({ name, articles }) {
  const { theme } = useTheme();
  const prettyCategory =
    name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

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
          boxShadow: "0 3px 12px rgba(0,0,0,0.5)",
          marginBottom: "18px",
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
                Kategori: {prettyCategory}
              </div>
            </div>
          </Link>

          {/* TOMBOL KEMBALI PREMIUM */}
          <BackButton href="/" label="← Kembali ke Beranda" />
        </div>
      </header>

      {/* KONTEN */}
      <main
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 16px 32px 16px",
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
          Kategori: {prettyCategory}
        </h1>

        {articles.length === 0 && (
          <p style={{ fontSize: 14, color: "#6b7280" }}>
            Belum ada berita pada kategori ini.
          </p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
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
                  {new Date(article.created_at).toLocaleDateString(
                    "id-ID",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                  {" • "}
                  {article.views}x dilihat
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

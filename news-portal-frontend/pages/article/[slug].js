// pages/article/[slug].js
import BackButton from "../../components/BackButton";
import BookmarkButton from "../../components/BookmarkButton";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "../../components/ThemeContext";
import { buildApiUrl } from '../../lib/api';

export async function getServerSideProps(context) {
  const { slug } = context.params;

  const res = await fetch(buildApiUrl(`/api/articles/${slug}`));

  if (!res.ok) {
    return { notFound: true };
  }

  const article = await res.json();
  return { props: { article } };
}

export default function ArticleDetail({ article }) {
  const { theme } = useTheme();

  const headerHeight = 90;

  // estimasi waktu baca
  const wordCount = article.content
    ? article.content.trim().split(/\s+/).length
    : 0;
  const readingTime = Math.max(1, Math.round(wordCount / 200));

  const [viewCount, setViewCount] = useState(article.views || 0);
  const [related, setRelated] = useState([]);

  // View counter: tambah view + ambil ulang
  useEffect(() => {
    const timer = setTimeout(() => {
      fetch(buildApiUrl(`/api/articles/${article.slug}/view`), {
        method: "POST",
      })
        .then(() =>
          fetch(buildApiUrl(`/api/articles/${article.slug}`))
        )
        .then((res) => res.json())
        .then((data) => setViewCount(data.views))
        .catch(console.error);
    }, 300);

    return () => clearTimeout(timer);
  }, [article.slug]);

  // Berita terkait
  useEffect(() => {
    if (!article.category) return;
    fetch(
      buildApiUrl(
        `/api/articles?category=${encodeURIComponent(article.category)}&limit=4`
      )
    )
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((a) => a.slug !== article.slug);
        setRelated(filtered);
      })
      .catch(console.error);
  }, [article.slug, article.category]);

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
          boxShadow: "0 2px 10px rgba(0,0,0,0.45)",
          position: "fixed",
          top: 0,
          width: "100%",
          left: 0,
          zIndex: 20,
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo + title */}
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
              style={{ height: 36, width: 36, objectFit: "contain" }}
            />
            <div>
              <div style={{ fontSize: "22px", fontWeight: "bold" }}>
                Portal Berita
              </div>
              <div
                style={{ fontSize: "11px", color: theme.headerSubText }}
              >
                Update berita terbaru untuk Anda
              </div>
            </div>
          </Link>

          {/* Tombol kanan */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Link
              href="/trending"
              style={{
                fontSize: "13px",
                color: "#fca5a5",
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: "999px",
                border: "1px solid rgba(255,99,99,0.4)",
                backgroundColor: "rgba(255,70,70,0.1)",
              }}
            >
              🔥 Trending
            </Link>
        {/* KEMBALI */}
            <BackButton href="/" label="← Kembali ke Beranda" />
          </div>
        </div>
      </header>

      {/* KONTEN */}
      <main
        style={{
          maxWidth: "900px",
          margin: `${headerHeight + 24}px auto 40px auto`,
          padding: "0 16px 32px 16px",
        }}
      >
        {/* KARTU ARTIKEL */}
        <article
          style={{
            backgroundColor: "white",
            borderRadius: "14px",
            boxShadow: "0 10px 30px rgba(15,23,42,0.15)",
            overflow: "hidden",
            marginBottom: "24px",
          }}
        >
          {/* GAMBAR */}
          {article.thumbnail_url && (
            <img
              src={article.thumbnail_url}
              alt={article.title}
              style={{
                width: "100%",
                maxHeight: "420px",
                objectFit: "cover",
              }}
            />
          )}

          <div style={{ padding: "18px 20px 24px 20px" }}>
            {/* BADGE KATEGORI */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  backgroundColor: "#e0f2fe",
                  color: "#0369a1",
                  padding: "4px 8px",
                  borderRadius: "999px",
                  fontWeight: 600,
                }}
              >
                {article.category || "Umum"}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: "#9ca3af",
                }}
              >
                HEADLINE
              </span>
            </div>

            {/* JUDUL */}
            <h1
              style={{
                fontSize: "26px",
                margin: "4px 0 8px 0",
                color: "#111827",
              }}
            >
              {article.title}
            </h1>

            {/* META DETAIL */}
            <div
              style={{
                fontSize: "12px",
                color: "#6b7280",
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginBottom: "16px",
              }}
            >
              {article.author && (
                <span>
                  Oleh <strong>{article.author}</strong>
                </span>
              )}
              <span>•</span>
              <span>
                {new Date(article.created_at).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span>•</span>
              <span>{readingTime} menit baca</span>
              <span>•</span>
              <span>{viewCount}x dilihat</span>
            </div>

            {/* GARIS PEMBATAS */}
            <div
              style={{
                height: "1px",
                background:
                  "linear-gradient(to right, #e5e7eb, #cbd5f5, #e5e7eb)",
                marginBottom: "16px",
              }}
            />

            {/* ISI ARTIKEL */}
            <div
              style={{
                lineHeight: 1.8,
                fontSize: "16px",
                color: "#374151",
                whiteSpace: "pre-line",
              }}
            >
              {article.content}
            </div>

            {/* ACTION BAR: BOOKMARK + SHARE */}
            <div
              style={{
                marginTop: "24px",
                paddingTop: "12px",
                borderTop: "1px solid #e5e7eb",
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <BookmarkButton article={article} />
              <ShareButtons article={article} />
            </div>
          </div>
        </article>

        {/* KOMENTAR */}
        <Comments articleId={article.id} />

        {/* BERITA TERKAIT */}
        {related.length > 0 && (
          <section style={{ marginTop: "32px" }}>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "12px",
                borderLeft: "4px solid #2563eb",
                paddingLeft: "8px",
              }}
            >
              Berita Terkait
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "14px",
              }}
            >
              {related.map((a) => (
                <article
                  key={a.id}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    overflow: "hidden",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                  }}
                >
                  {a.thumbnail_url && (
                    <img
                      src={a.thumbnail_url}
                      alt={a.title}
                      style={{
                        width: "100%",
                        height: "120px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <div style={{ padding: "8px 10px 10px 10px" }}>
                    <span
                      style={{
                        fontSize: "10px",
                        textTransform: "uppercase",
                        color: "#6b7280",
                      }}
                    >
                      {a.category}
                    </span>
                    <h3
                      style={{
                        fontSize: "14px",
                        margin: "4px 0 6px 0",
                      }}
                    >
                      <Link
                        href={`/article/${a.slug}`}
                        style={{
                          textDecoration: "none",
                          color: "#111827",
                        }}
                      >
                        {a.title}
                      </Link>
                    </h3>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#9ca3af",
                      }}
                    >
                      {new Date(a.created_at).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

/* ===== KOMENTAR ===== */
function Comments({ articleId }) {
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  // ambil komentar
  useEffect(() => {
    fetch(buildApiUrl(`/api/comments/${articleId}`))
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch(console.error);
  }, [articleId]);

  async function sendComment() {
    if (!message.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(
        buildApiUrl(`/api/comments/${articleId}`),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username || "Anonim",
            message,
          }),
        }
      );

      const data = await res.json();
      if (res.status === 429) {
        alert(data.error);
      } else if (!res.ok) {
        alert("Gagal mengirim komentar.");
      } else {
        setComments((prev) => [data, ...prev]);
        setMessage("");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: "30px" }}>
      <h2 style={{ fontSize: "18px", marginBottom: "10px" }}>💬 Komentar</h2>

      {/* Form input */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginBottom: "16px",
        }}
      >
        <input
          type="text"
          placeholder="Nama (opsional)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
          }}
        />

        <textarea
          placeholder="Tulis komentar..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{
            height: "70px",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
          }}
        />

        <button
          onClick={sendComment}
          disabled={loading}
          style={{
            padding: "8px 12px",
            backgroundColor: "#2563eb",
            color: "white",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          {loading ? "Mengirim..." : "Kirim Komentar"}
        </button>
      </div>

      {/* Daftar komentar */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {comments.length === 0 && (
          <p style={{ fontSize: "13px", color: "#6b7280" }}>
            Belum ada komentar. Jadilah yang pertama!
          </p>
        )}
        {comments.map((c) => (
          <div
            key={c.id}
            style={{
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
            }}
          >
            <strong>{c.username}</strong>
            <p style={{ margin: "6px 0", color: "#4b5563" }}>{c.message}</p>
            <div style={{ fontSize: "11px", color: "#9ca3af" }}>
              {new Date(c.created_at).toLocaleString("id-ID")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== SHARE BUTTONS ===== */
function ShareButtons({ article }) {
  const url = `http://localhost:3000/article/${article.slug}`;

  const buttons = [
    {
      label: "WhatsApp",
      color: "#25D366",
      link: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        article.title + " " + url
      )}`,
    },
    {
      label: "Facebook",
      color: "#1877F2",
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
    },
    {
      label: "Twitter",
      color: "#1DA1F2",
      link: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(article.title)}`,
    },
  ];

  return (
    <div>
      <div
        style={{
          fontSize: "13px",
          marginBottom: "6px",
          color: "#6b7280",
        }}
      >
        Bagikan:
      </div>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {buttons.map((b) => (
          <a
            key={b.label}
            href={b.link}
            target="_blank"
            rel="noreferrer"
            style={{
              padding: "6px 12px",
              borderRadius: "999px",
              backgroundColor: b.color,
              color: "white",
              fontSize: "12px",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            {b.label}
          </a>
        ))}

        <button
          onClick={() => navigator.clipboard.writeText(url)}
          style={{
            padding: "6px 12px",
            borderRadius: "999px",
            backgroundColor: "#374151",
            color: "white",
            fontSize: "12px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Copy Link
        </button>
      </div>
    </div>
  );
}
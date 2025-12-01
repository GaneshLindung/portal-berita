// pages/index.js
import { useTheme } from "../components/ThemeContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { API_BASE_URL, safeFetchJson } from "../lib/api";

export async function getServerSideProps() {
  const [featured, latest, popular] = await Promise.all([
    safeFetchJson("/api/articles/featured", []),
    safeFetchJson("/api/articles?limit=6", []),
    safeFetchJson("/api/articles?sort=popular&limit=5", []),
  ]);

  return {
    props: {
      featured,
      initialLatest: latest,
      popular,
    },
  };
}

export default function Home({ featured, initialLatest, popular }) {
  const router = useRouter();
  const { theme, mode, setMode } = useTheme();

  const headerHeight = 190;
  const [navbarHidden, setNavbarHidden] = useState(false);

  // state untuk "Muat lebih banyak"
  const [latest, setLatest] = useState(initialLatest);
  const [offset, setOffset] = useState(initialLatest.length);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialLatest.length > 0);

  async function loadMore() {
    try {
      setLoadingMore(true);
      const res = await fetch(
        `${API_BASE_URL}/api/articles?limit=6&offset=${offset}`
      );
      if (!res.ok) {
        throw new Error(`Failed to load more articles (${res.status})`);
      }
      const more = await res.json();

      if (more.length === 0) {
        setHasMore(false);
        return;
      }

      setLatest((prev) => [...prev, ...more]);
      setOffset((prev) => prev + more.length);
      if (more.length < 6) setHasMore(false);
    } catch (err) {
      console.error("Error loading more articles:", err);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    const q = e.target.q.value.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  const categories = ['Politik', 'Teknologi', 'Olahraga'];

  return (
    <div
      style={{
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
        backgroundColor: theme.pageBg,
        color: theme.pageText,
        minHeight: '100vh',
      }}
    >
      <button
        type="button"
        onClick={() => setNavbarHidden((prev) => !prev)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 30,
          width: '50px',
          height: '50px',
          borderRadius: '999px',
          border: `1px solid ${theme.headerBorder}`,
          background: navbarHidden
            ? 'linear-gradient(135deg, #0ea5e9, #2563eb)'
            : 'linear-gradient(135deg, #0f172a, #1f2937)',
          color: 'white',
          boxShadow: '0 10px 24px rgba(0,0,0,0.45)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        aria-label={navbarHidden ? 'Tampilkan navbar' : 'Sembunyikan navbar'}
        title={navbarHidden ? 'Tampilkan navbar' : 'Sembunyikan navbar'}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.04)';
          e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,0,0,0.45)';
        }}
      >
        <span style={{ fontSize: '20px' }}>
          {navbarHidden ? '👁️' : '🙈'}
        </span>
        <span
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
        >
          {navbarHidden ? 'Tampilkan navbar' : 'Sembunyikan navbar'}
        </span>
      </button>      
      {/* HEADER BARU */}
      <header
        style={{
          display: navbarHidden ? 'none' : 'block',
          background: theme.headerBg,
          color: 'white',
          padding: '16px 0 18px 0',
          boxShadow: '0 12px 30px rgba(15,23,42,0.7)',
          position: 'fixed',
          top: 0,
          zIndex: 20,
          width: '100%',
          left: 0,
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '0 16px',
          }}
        >
          {/* KAPSUL TRANSPARAN */}
          <div
            style={{
              backgroundColor: theme.headerCapsuleBg,
              borderRadius: '18px',
              padding: '10px 16px 12px 16px',
              border: `1px solid ${theme.headerBorder}`,
              backdropFilter: 'blur(12px)',
              boxShadow: '0 14px 35px rgba(15,23,42,0.7)',
            }}
          >
            {/* BARIS ATAS: LOGO + SEARCH + THEME TOGGLE */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '18px',
                flexWrap: 'wrap',
              }}
            >
              {/* LOGO */}
              <Link
                href="/"
                style={{
                  textDecoration: 'none',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <img
                  src="/images/logo.png"
                  alt="Portal Berita"
                  style={{
                    height: "40px",
                    width: "40px",
                    objectFit: "contain"
                  }}
                />

                <div>
                  <div
                    style={{
                      fontSize: '22px',
                      fontWeight: 'bold',
                      letterSpacing: '0.03em',
                    }}
                  >
                    Portal Berita
                  </div>
                  <div style={{ fontSize: '11px', color: theme.headerSubText }}>
                    Update berita terbaru untuk Anda
                  </div>
                </div>
              </Link>

              {/* SEARCH + THEME TOGGLE */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  flex: 1,
                  justifyContent: 'flex-end',
                  minWidth: '220px',
                }}
              >
                {/* SEARCH */}
                <form
                  onSubmit={handleSearch}
                  style={{ flex: 1, minWidth: '200px', maxWidth: '320px' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      backgroundColor: 'white',
                      borderRadius: '999px',
                      overflow: 'hidden',
                      padding: '2px 4px',
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    <input
                      type="text"
                      name="q"
                      placeholder="Cari berita..."
                      style={{
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        padding: '6px 10px',
                        fontSize: '13px',
                        borderRadius: '999px',
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        border: 'none',
                        padding: '6px 14px',
                        fontSize: '13px',
                        cursor: 'pointer',
                        background:
                          'linear-gradient(135deg, #2563eb, #1d4ed8)',
                        color: 'white',
                        borderRadius: '999px',
                        fontWeight: 500,
                      }}
                    >
                      Cari
                    </button>
                  </div>
                </form>

                {/* THEME TOGGLE */}
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    backgroundColor: "rgba(15,23,42,0.9)",
                    borderRadius: 999,
                    padding: "3px 6px",
                    border: `1px solid ${theme.headerBorder}`,
                  }}
                >
                  {[
                    { id: "light", label: "☀" },
                    { id: "system", label: "A" },
                    { id: "dark", label: "🌙" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setMode(item.id)}
                      style={{
                        border: "none",
                        cursor: "pointer",
                        padding: "3px 8px",
                        borderRadius: 999,
                        fontSize: 12,
                        backgroundColor:
                          mode === item.id ? "white" : "transparent",
                        color: mode === item.id ? "#0f172a" : "#e5e7eb",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* BARIS BAWAH: NAV + TANGGAL */}
            <div
              style={{
                marginTop: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              {/* NAV */}
              <nav
                style={{
                  display: 'flex',
                  gap: '8px',
                  fontSize: '13px',
                  flexWrap: 'wrap',
                }}
              >
                {/* MENU SEMUA */}
                <Link
                  href="/"
                  style={{
                    padding: '4px 10px',
                    borderRadius: '999px',
                    backgroundColor: '#0f172a',
                    color: '#e5e7eb',
                    fontWeight: 500,
                    border: '1px solid rgba(148,163,184,0.4)',
                  }}
                >
                  Semua
                </Link>

                {/* MENU TRENDING */}
                <Link
                  href="/trending"
                  style={{
                    padding: '4px 10px',
                    borderRadius: '999px',
                    color: '#fca5a5',
                    fontWeight: 600,
                    border: '1px solid rgba(255,70,70,0.3)',
                    backgroundColor: 'rgba(255,80,80,0.1)',
                  }}
                >
                  🔥 Trending
                </Link>

                {/* MENU KATEGORI */}
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/category/${encodeURIComponent(cat)}`}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '999px',
                      color: '#cbd5f5',
                      border: '1px solid transparent',
                      backgroundColor: 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#111827';
                      e.currentTarget.style.borderColor =
                        'rgba(148,163,184,0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                  >
                    {cat}
                  </Link>
                ))}
              </nav>

              {/* TANGGAL */}
              <div
                style={{
                  fontSize: '11px',
                  color: theme.headerSubText,
                }}
              >
                {new Date().toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main
        style={{
          maxWidth: '1100px',
          margin: `${(navbarHidden ? 40 : headerHeight + 16)}px auto 0 auto`,
          padding: '0 16px 40px 16px',
        }}
      >
        {/* FEATURED */}
        {featured && featured.length > 0 && (
          <section
            style={{
              marginBottom: '32px',
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
              gap: '20px',
            }}
          >
            <FeaturedHero article={featured[0]} />

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {featured.slice(1).map((a) => (
                <SmallFeatured key={a.id} article={a} />
              ))}
            </div>
          </section>
        )}

        {/* KONTEN: terbaru + populer */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 1.3fr)',
            gap: '24px',
          }}
        >
          {/* BERITA TERBARU */}
          <div>
            <h2
              style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px',
                borderLeft: '4px solid #2563eb',
                paddingLeft: '8px',
              }}
            >
              Berita Terbaru
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '16px',
              }}
            >
              {latest.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>

            {/* TOMBOL MUAT LEBIH BANYAK */}
            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '999px',
                    border: 'none',
                    backgroundColor: '#111827',
                    color: 'white',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  {loadingMore ? 'Memuat...' : 'Muat lebih banyak'}
                </button>
              </div>
            )}
            {!hasMore && (
              <p
                style={{
                  textAlign: 'center',
                  fontSize: '12px',
                  color: '#9ca3af',
                  marginTop: '16px',
                }}
              >
                Tidak ada berita lagi.
              </p>
            )}
          </div>

          {/* SIDEBAR POPULER */}
          <aside>
            <h2
              style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '10px',
                borderLeft: '4px solid #f97316',
                paddingLeft: '8px',
              }}
            >
              Berita Populer
            </h2>
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                padding: '12px 14px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
              }}
            >
              {popular.map((article, idx) => (
                <div
                  key={article.id}
                  style={{
                    display: 'flex',
                    gap: '8px',
                    padding: '8px 0',
                    borderBottom:
                      idx === popular.length - 1
                        ? 'none'
                        : '1px solid #e5e7eb',
                  }}
                >
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#f97316',
                      width: '20px',
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <Link
                      href={`/article/${article.slug}`}
                      style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#111827',
                        textDecoration: 'none',
                      }}
                    >
                      {article.title}
                    </Link>
                    <div
                      style={{
                        fontSize: '11px',
                        color: '#9ca3af',
                        marginTop: '2px',
                      }}
                    >
                      {article.category} •{' '}
                      {new Date(article.created_at).toLocaleDateString(
                        'id-ID',
                        {
                          day: '2-digit',
                          month: 'short',
                        }
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </main>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: '1px solid #e5e7eb',
          padding: '16px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#9ca3af',
        }}
      >
        © {new Date().getFullYear()} Portal Berita. Semua hak cipta dilindungi.
      </footer>
    </div>
  );
}

/** Komponen headline besar */
function FeaturedHero({ article }) {
  return (
    <article
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
      }}
    >
      {article.thumbnail_url && (
        <img
          src={article.thumbnail_url}
          alt={article.title}
          style={{
            width: '100%',
            height: '260px',
            objectFit: 'cover',
          }}
        />
      )}
      <div style={{ padding: '14px 16px 18px 16px' }}>
        <span
          style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            color: '#2563eb',
            fontWeight: 600,
          }}
        >
          HEADLINE • {article.category}
        </span>
        <h2
          style={{
            fontSize: '22px',
            margin: '6px 0 8px 0',
            color: '#111827',
          }}
        >
          <Link
            href={`/article/${article.slug}`}
            style={{ textDecoration: 'none', color: '#111827' }}
          >
            {article.title}
          </Link>
        </h2>
        <p
          style={{
            fontSize: '13px',
            color: '#4b5563',
            marginBottom: '8px',
          }}
        >
          {article.excerpt || ''}
        </p>
        <div
          style={{
            fontSize: '11px',
            color: '#9ca3af',
          }}
        >
          {article.author && `${article.author} • `}
          {new Date(article.created_at).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </div>
      </div>
    </article>
  );
}

/** Komponen headline kecil */
function SmallFeatured({ article }) {
  return (
    <article
      style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        overflow: 'hidden',
        display: 'flex',
        gap: '10px',
        boxShadow: '0 3px 10px rgba(0,0,0,0.05)',
      }}
    >
      {article.thumbnail_url && (
        <img
          src={article.thumbnail_url}
          alt={article.title}
          style={{
            width: '110px',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}
      <div style={{ padding: '8px 10px' }}>
        <span
          style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            color: '#6b7280',
          }}
        >
          {article.category}
        </span>
        <h3
          style={{
            fontSize: '14px',
            fontWeight: 600,
            margin: '4px 0 4px 0',
          }}
        >
          <Link
            href={`/article/${article.slug}`}
            style={{ textDecoration: 'none', color: '#111827' }}
          >
            {article.title}
          </Link>
        </h3>
      </div>
    </article>
  );
}

/** Kartu berita umum (grid) */
function NewsCard({ article }) {
  return (
    <article
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
      }}
    >
      {article.thumbnail_url && (
        <img
          src={article.thumbnail_url}
          alt={article.title}
          style={{
            width: '100%',
            height: '150px',
            objectFit: 'cover',
          }}
        />
      )}
      <div
        style={{
          padding: '10px 12px 12px 12px',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        {/* badge kategori */}
        <span
          style={{
            alignSelf: 'flex-start',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            backgroundColor: '#eef2ff',
            color: '#4f46e5',
            padding: '3px 7px',
            borderRadius: '999px',
            marginBottom: '6px',
          }}
        >
          {article.category || 'Umum'}
        </span>

        <h3
          style={{
            fontSize: '16px',
            margin: '0 0 6px 0',
          }}
        >
          <Link
            href={`/article/${article.slug}`}
            style={{ textDecoration: 'none', color: '#111827' }}
          >
            {article.title}
          </Link>
        </h3>

        {article.excerpt && (
          <p
            style={{
              fontSize: '13px',
              color: '#6b7280',
              marginBottom: '8px',
            }}
          >
            {article.excerpt}
          </p>
        )}

        {/* meta singkat */}
        <div
          style={{
            marginTop: 'auto',
            fontSize: '11px',
            color: '#9ca3af',
            display: 'flex',
            justifyContent: 'space-between',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          <span>
            {article.author || 'Redaksi'} •{' '}
            {new Date(article.created_at).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'short',
            })}
          </span>
        </div>
      </div>
    </article>
  );
}
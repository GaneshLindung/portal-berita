// pages/search.js
import Link from 'next/link';

export async function getServerSideProps(context) {
  const { q = '' } = context.query;
  const baseUrl = 'http://localhost:4000';

  if (!q) {
    return { props: { q: '', articles: [] } };
  }

  const res = await fetch(
    `${baseUrl}/api/articles?q=${encodeURIComponent(q)}&limit=20`
  );
  const articles = await res.json();

  return { props: { q, articles } };
}

export default function SearchPage({ q, articles }) {
  return (
    <div
      style={{
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        backgroundColor: '#f3f4f6',
        minHeight: '100vh',
      }}
    >
      <main
        style={{
          maxWidth: '1000px',
          margin: '20px auto',
          padding: '0 16px 40px 16px',
        }}
      >
        <Link href="/" style={{ fontSize: '13px', color: '#2563eb' }}>
          ← Kembali ke beranda
        </Link>
        <h1
          style={{
            fontSize: '22px',
            margin: '10px 0 6px 0',
          }}
        >
          Hasil pencarian: "{q}"
        </h1>
        <p
          style={{
            fontSize: '13px',
            color: '#6b7280',
            marginBottom: '16px',
          }}
        >
          Ditemukan {articles.length} berita
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
          }}
        >
          {articles.map((a) => (
            <article
              key={a.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
              }}
            >
              {a.thumbnail_url && (
                <img
                  src={a.thumbnail_url}
                  alt={a.title}
                  style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                />
              )}
              <div style={{ padding: '10px 12px' }}>
                <h2 style={{ fontSize: '16px', marginBottom: '6px' }}>
                  <Link
                    href={`/article/${a.slug}`}
                    style={{ textDecoration: 'none', color: '#111827' }}
                  >
                    {a.title}
                  </Link>
                </h2>
                <p
                  style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    marginBottom: '4px',
                  }}
                >
                  {a.excerpt}
                </p>
                <div
                  style={{
                    fontSize: '11px',
                    color: '#9ca3af',
                  }}
                >
                  {new Date(a.created_at).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

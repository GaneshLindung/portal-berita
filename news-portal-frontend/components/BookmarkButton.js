// components/BookmarkButton.js
import { useEffect, useState } from "react";

const STORAGE_KEY = "portal_berita_bookmarks";

export default function BookmarkButton({ article }) {
  const [saved, setSaved] = useState(false);

  // Cek apakah artikel ini sudah disimpan
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setSaved(list.some((a) => a.id === article.id));
    } catch {
      setSaved(false);
    }
  }, [article.id]);

  function toggleBookmark() {
    if (typeof window === "undefined") return;

    try {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      let updated;

      if (saved) {
        // hapus dari bookmark
        updated = list.filter((a) => a.id !== article.id);
      } else {
        // simpan (pakai data penting saja)
        const minimal = {
          id: article.id,
          slug: article.slug,
          title: article.title,
          thumbnail_url: article.thumbnail_url,
          category: article.category,
          created_at: article.created_at,
          excerpt: article.excerpt,
        };
        updated = [minimal, ...list];
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setSaved(!saved);
    } catch (err) {
      console.error("Bookmark error:", err);
    }
  }

  return (
    <button
      onClick={toggleBookmark}
      style={{
        padding: "8px 14px",
        borderRadius: "999px",
        backgroundColor: saved ? "#d97706" : "#374151",
        color: "white",
        border: "none",
        cursor: "pointer",
        fontSize: "13px",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <span style={{ fontSize: "15px" }}>{saved ? "★" : "☆"}</span>
      <span>{saved ? "Disimpan" : "Simpan"}</span>
    </button>
  );
}
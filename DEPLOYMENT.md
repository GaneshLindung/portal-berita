# Panduan Deploy ke Vercel

Dokumen ini berisi langkah lengkap untuk men-deploy monorepo ini ke Vercel sehingga aplikasi Next.js di `news-portal-frontend` tidak terkena error 404 setelah di-hosting.

## 1. Menyiapkan project di Vercel
1. Buat project baru di Vercel dari repository ini.
2. Pada bagian **Root Directory**, pilih `news-portal-frontend` (agar Vercel membangun Next.js dari folder yang benar).
3. Pastikan Environment Variables yang dibutuhkan aplikasi (jika ada) diisi pada tab **Settings → Environment Variables**.

## 2. Perintah build
Vercel otomatis membaca `vercel.json` di root repository ini, tetapi pastikan perintah berikut berlaku jika Anda mengatur lewat dashboard:
- **Install Command**: `cd news-portal-frontend && npm install`
- **Build Command**: `cd news-portal-frontend && npm run build`

## 3. Routing
Konfigurasi `vercel.json` sudah menambahkan rute wildcard:
```json
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "news-portal-frontend/$1"
    }
  ]
}
```
Ini memastikan semua permintaan diarahkan ke aplikasi Next.js di subdirektori sehingga tidak terjadi 404 ketika mengakses path apa pun.

## 4. Deploy
1. Push perubahan ke branch yang terhubung dengan Vercel.
2. Trigger deploy dari dashboard atau biarkan deploy otomatis berjalan.
3. Setelah deploy selesai, buka URL pratinjau/produksi dan pastikan halaman serta rute dinamis/non-dinamis berfungsi.

## 5. Troubleshooting
- Jika masih muncul 404, pastikan proyek menggunakan **Root Directory** `news-portal-frontend`. Deploy ulang setelah mengubah pengaturan ini.
- Pastikan `npm run build` berjalan sukses secara lokal sebelum deploy untuk memverifikasi tidak ada error build.
- Jika ada backend atau API terpisah di `news-portal-backend`, deploy secara terpisah (misalnya ke layanan lain) atau tambahkan proxy/API routes sesuai kebutuhan.

# REST API Backend

REST API sederhana untuk mengelola koleksi item dengan operasi CRUD.

## Struktur Proyek

```
day25/
├── src/
│   ├── app.js              # Main application file
│   ├── routes/
│   │   └── items.js        # Routes untuk items endpoints
│   └── data/
│       └── items.json      # Mock data untuk development
├── package.json
├── .gitignore
├── README.md
└── API_SPECIFICATION.md    # Dokumentasi API lengkap
```

## Instalasi

1. Clone repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Menjalankan Aplikasi

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## API Endpoints

- `GET /api/items` - Mengambil semua item
- `GET /api/items/:id` - Mengambil item berdasarkan ID

Lihat `API_SPECIFICATION.md` untuk dokumentasi lengkap.

## Teknologi

- Node.js
- Express.js
- JSON (mock data)

## Status Development

- [x] Spesifikasi API
- [x] Setup proyek
- [ ] Konfigurasi package.json
- [ ] Implementasi server Express
- [ ] Endpoint GET semua item
- [ ] Endpoint GET item by ID

# REST API Backend

REST API sederhana untuk mengelola koleksi item dengan operasi CRUD.

## Struktur Proyek

```
day25/
├── src/                    # Local development
│   ├── app.js              # Main application file
│   ├── routes/
│   │   └── items.js        # Routes untuk items endpoints
│   └── data/
│       └── items.json      # Mock data untuk development
├── api/                    # Vercel serverless functions
│   ├── index.js            # Main API handler
│   └── items/
│       ├── index.js        # GET /api/items
│       └── [id].js         # GET /api/items/[id]
├── public/                 # Static files untuk Vercel
│   └── index.html          # API documentation page
├── data/
│   └── items.json          # Mock data untuk production
├── package.json
├── vercel.json             # Vercel configuration
├── .vercelignore           # Vercel ignore rules
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

### Development Mode (Local)
```bash
npm run dev
```

### Production Mode (Local)
```bash
npm start
```

### Development Mode (Vercel)
```bash
npm run vercel-dev
```

### Deploy ke Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy production
vercel --prod
```

## API Endpoints

### Local Development
- `GET http://localhost:3000/api/items` - Mengambil semua item
- `GET http://localhost:3000/api/items/:id` - Mengambil item berdasarkan ID

### Vercel Production
- `GET https://your-app.vercel.app/api/items` - Mengambil semua item
- `GET https://your-app.vercel.app/api/items/[id]` - Mengambil item berdasarkan ID

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

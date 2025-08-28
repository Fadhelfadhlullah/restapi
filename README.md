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

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

### Setup Local Development

1. **Clone repository**
   ```bash
   git clone https://github.com/username/day25-rest-api.git
   cd day25-rest-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file sesuai kebutuhan
   ```

4. **Start database dengan Docker**
   ```bash
   docker-compose up -d postgres redis
   ```

5. **Verify database connection**
   ```bash
   # Database akan otomatis ter-setup dengan sample data
   # Akses pgAdmin di http://localhost:8080
   # Email: admin@day25.com, Password: admin123
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

### Docker Development
```bash
# Start semua services
docker-compose up

# Start hanya database
docker-compose up -d postgres redis

# Stop semua services
docker-compose down

# Rebuild dan start
docker-compose up --build
```

## API Endpoints

### Items Management
- `GET /api/items` - Get all items (with pagination, filtering, sorting)
- `GET /api/items/:id` - Get item by ID
- `POST /api/items` - Create new item
- `PATCH /api/items/:id` - Update item (partial update)
- `DELETE /api/items/:id` - Delete item
- `GET /api/items/meta/categories` - Get all categories

### System
- `GET /health` - Health check
- `GET /` - API documentation

Lihat `API_SPECIFICATION.md` dan `HTTP_STATUS_CODES.md` untuk dokumentasi lengkap.

## Teknologi

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Primary database
- **Redis** - Caching (optional)

### Validation & Security
- **Joi** - Data validation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

### Development & Deployment
- **Docker & Docker Compose** - Containerization
- **Vercel** - Serverless deployment
- **Nodemon** - Development auto-reload

### Database
- **pg** - PostgreSQL client
- **Connection pooling** - Optimized database connections
- **Transactions** - ACID compliance

## Status Development

- [x] Spesifikasi API
- [x] Setup proyek
- [ ] Konfigurasi package.json
- [ ] Implementasi server Express
- [ ] Endpoint GET semua item
- [ ] Endpoint GET item by ID

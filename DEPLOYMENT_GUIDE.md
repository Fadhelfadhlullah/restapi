# 🚀 Panduan Deployment ke Vercel

## Persiapan Deployment

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login ke Vercel
```bash
vercel login
```

### 3. Test Local dengan Vercel Dev
```bash
npm run vercel-dev
```
Server akan berjalan di `http://localhost:3000`

## Deployment ke Vercel

### 1. Deploy Development
```bash
vercel
```

### 2. Deploy Production
```bash
vercel --prod
```

### 3. Deploy dengan Custom Domain (Opsional)
```bash
vercel --prod --alias your-custom-domain.com
```

## Struktur File untuk Vercel

### File Konfigurasi
- `vercel.json` - Konfigurasi deployment Vercel
- `.vercelignore` - File yang diabaikan saat deployment
- `api/` - Folder untuk serverless functions

### Serverless Functions
- `api/index.js` - Handler utama untuk root endpoint
- `api/items/index.js` - Handler untuk GET /api/items
- `api/items/[id].js` - Handler untuk GET /api/items/[id]

## Environment Variables (Jika Diperlukan)

### Local Development
Buat file `.env.local`:
```
NODE_ENV=development
API_URL=http://localhost:3000
```

### Vercel Production
Set environment variables di Vercel Dashboard:
```
NODE_ENV=production
API_URL=https://your-app.vercel.app
```

## Testing Endpoints

### Local Testing
```bash
# Test semua items
curl http://localhost:3000/api/items

# Test item by ID
curl http://localhost:3000/api/items/1

# Test health check
curl http://localhost:3000/health
```

### Production Testing
```bash
# Test semua items
curl https://your-app.vercel.app/api/items

# Test item by ID
curl https://your-app.vercel.app/api/items/1

# Test health check
curl https://your-app.vercel.app/health
```

## Troubleshooting

### 1. Function Timeout
Jika function timeout, edit `vercel.json`:
```json
{
  "functions": {
    "api/**/*.js": {
      "maxDuration": 30
    }
  }
}
```

### 2. Builds vs Functions Error
Jika muncul error "The `functions` property cannot be used in conjunction with the `builds` property":
- Hapus property `builds` dari `vercel.json`
- Gunakan hanya `functions` dan `rewrites`

### 2. CORS Issues
Headers CORS sudah dikonfigurasi di setiap endpoint:
```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
```

### 3. File Path Issues
Data JSON menggunakan `process.cwd()` untuk path yang benar:
```javascript
const dataPath = path.join(process.cwd(), 'data', 'items.json');
```

### 4. Cold Start
Vercel functions memiliki cold start. Untuk mengurangi latency:
- Gunakan function yang ringan
- Minimize dependencies
- Implement caching jika diperlukan

## Monitoring

### 1. Vercel Dashboard
- Monitor function invocations
- Check error logs
- View performance metrics

### 2. Function Logs
```bash
vercel logs your-app-url
```

### 3. Real-time Logs
```bash
vercel logs your-app-url --follow
```

## Next Steps

1. **Custom Domain**: Setup domain kustom di Vercel Dashboard
2. **Analytics**: Enable Vercel Analytics untuk monitoring
3. **Database**: Integrate dengan database (MongoDB, PostgreSQL, etc.)
4. **Authentication**: Tambahkan authentication (Auth0, NextAuth, etc.)
5. **Rate Limiting**: Implement rate limiting untuk production
6. **Caching**: Setup caching strategy untuk performance

## Useful Commands

```bash
# List deployments
vercel ls

# Remove deployment
vercel rm deployment-url

# View deployment info
vercel inspect deployment-url

# Set environment variable
vercel env add

# Pull environment variables
vercel env pull
```

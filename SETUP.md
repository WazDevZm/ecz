# ZedPulse Elections Dashboard - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/pnpm
- Python 3.9+
- MongoDB 6+
- Docker & Docker Compose (optional)

## 📦 Installation Methods

### Method 1: Docker (Recommended)

1. **Clone and navigate to project**
```bash
cd zedpulse
```

2. **Start all services**
```bash
docker-compose up --build
```

3. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Sentiment Service: http://localhost:8000

### Method 2: Manual Setup

#### Backend Setup

1. **Navigate to backend**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env` and set:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/zedpulse
JWT_SECRET=your-super-secret-jwt-key-change-this
SENTIMENT_SERVICE_URL=http://localhost:8000
NODE_ENV=development
ENABLE_DATA_INGESTION=true
```

4. **Seed the database**
```bash
npm run seed
```

5. **Start the server**
```bash
npm run dev
```

#### Sentiment Service Setup

1. **Navigate to sentiment service**
```bash
cd sentiment-service
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment**
```bash
cp .env.example .env
```

5. **Start the service**
```bash
uvicorn main:app --reload --port 8000
```

#### Frontend Setup

1. **Navigate to frontend**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

4. **Start development server**
```bash
npm run dev
```

## 🔐 Default Credentials

After seeding the database:

```
Email: admin@zedpulse.zm
Password: Admin@2026
```

**⚠️ IMPORTANT: Change these credentials immediately in production!**

## 📊 Database Seeding

The seed script creates:
- 1 Admin user
- 4 Political parties (UPND, PF, SP, UKA)
- 3 Presidential candidates
- 10 Zambian provinces

Run seeding:
```bash
cd backend
npm run seed
```

## 🧪 Testing the Application

### 1. Test Backend API
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{"status":"ok","timestamp":"2026-04-29T..."}
```

### 2. Test Sentiment Service
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"text":"The economy is improving"}'
```

### 3. Test Frontend
Open browser to http://localhost:5173

## 🔧 Configuration

### Enable Data Ingestion

To enable mock data ingestion (generates sample posts every 5 minutes):

In `backend/.env`:
```env
ENABLE_DATA_INGESTION=true
```

### Configure Real Data Sources

To connect real social media APIs, add to `backend/.env`:
```env
TWITTER_API_KEY=your_key
TWITTER_API_SECRET=your_secret
FACEBOOK_ACCESS_TOKEN=your_token
NEWS_API_KEY=your_key
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# Start MongoDB (macOS with Homebrew)
brew services start mongodb-community

# Start MongoDB (Linux)
sudo systemctl start mongod
```

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Python Dependencies Issues
```bash
# Upgrade pip
pip install --upgrade pip

# Install with verbose output
pip install -r requirements.txt -v
```

### Frontend Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📱 Production Deployment

### Build Frontend
```bash
cd frontend
npm run build
```

### Environment Variables for Production

**Backend:**
```env
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db
JWT_SECRET=strong-random-secret
FRONTEND_URL=https://your-domain.com
```

**Frontend:**
```env
VITE_API_URL=https://api.your-domain.com
VITE_SOCKET_URL=https://api.your-domain.com
```

### Docker Production Deployment
```bash
docker-compose -f docker-compose.yml up -d
```

## 🔒 Security Checklist

- [ ] Change default admin password
- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS in production
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for secrets
- [ ] Regular security updates

## 📚 API Documentation

Once backend is running, API docs available at:
- Swagger UI: http://localhost:5000/api-docs (if configured)
- Sentiment API: http://localhost:8000/docs

## 🎯 Next Steps

1. ✅ Complete setup
2. ✅ Login with admin credentials
3. ✅ Explore the dashboard
4. ✅ Create custom alerts
5. ✅ Generate reports
6. ✅ Configure data sources
7. ✅ Customize for your needs

## 💡 Tips

- Use the 24h/7d/30d filters to view different time ranges
- Real-time updates appear automatically via WebSocket
- Export reports in PDF or CSV format
- Admin panel allows user management
- Alerts notify you of sentiment spikes

## 🆘 Support

For issues:
1. Check this setup guide
2. Review error logs
3. Check GitHub issues
4. Open a new issue with details

## 📄 License

MIT License - See LICENSE file

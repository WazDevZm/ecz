# ZedPulse Elections Dashboard

A modern political sentiment intelligence platform focused on Zambia's election season.

## ⚠️ Important Disclaimer

**This platform monitors digital conversation trends and does not predict election results or represent official voter behavior. Social media sentiment does not represent actual voting outcomes.**

## Features

- 📊 Real-time sentiment analysis of political discussions
- 🗺️ Interactive province-based sentiment mapping
- 📈 Trend tracking for parties and candidates
- 🔔 Custom alerts for sentiment spikes
- 📱 Responsive design with dark mode
- 🔐 Role-based authentication (Admin, Analyst, Viewer)
- 📄 Exportable reports (PDF, CSV)

## Tech Stack

### Frontend
- React.js + Vite
- Tailwind CSS
- Recharts for data visualization
- Socket.io-client for real-time updates
- React Router for navigation

### Backend
- Node.js + Express
- MongoDB for data storage
- JWT authentication
- Socket.io for real-time communication

### Sentiment Analysis Service
- Python FastAPI
- HuggingFace Transformers
- VADER Sentiment Analysis

### Deployment
- Docker & Docker Compose
- Nginx reverse proxy

## Project Structure

```
zedpulse/
├── frontend/          # React + Vite application
├── backend/           # Node.js + Express API
├── sentiment-service/ # Python FastAPI microservice
├── docker-compose.yml # Container orchestration
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- MongoDB 6+
- Docker & Docker Compose (optional)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd zedpulse
```

2. **Setup Frontend**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

3. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

4. **Setup Sentiment Service**
```bash
cd sentiment-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Deployment

### Deploy to Vercel (Recommended for Frontend)

The easiest way to deploy this application is using Vercel:

1. **Quick Deploy** (5 minutes): See [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)
2. **Full Guide**: See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
3. **Checklist**: Use [VERCEL_CHECKLIST.md](./VERCEL_CHECKLIST.md)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/zedpulse)

**Important**: Vercel serverless functions don't support WebSockets. For full real-time features, deploy the backend separately to Railway, Render, or Heroku.

### Alternative Deployment Options

- **Docker**: Use the included `docker-compose.yml`
- **Railway**: Great for the backend with Socket.io support
- **Render**: Free tier available for backend deployment
- **Heroku**: Traditional PaaS option

### Using Docker

```bash
docker-compose up --build
```

Access the application at `http://localhost:5173`

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/zedpulse
JWT_SECRET=your-secret-key
SENTIMENT_SERVICE_URL=http://localhost:8000
NODE_ENV=development
```

### Sentiment Service (.env)
```
PORT=8000
MODEL_NAME=cardiffnlp/twitter-roberta-base-sentiment
```

## API Documentation

API documentation available at `http://localhost:5000/api-docs` when backend is running.

## Default Admin Credentials

```
Email: admin@zedpulse.zm
Password: Admin@2026
```

**⚠️ Change these credentials immediately in production!**

## Features Overview

### 1. Landing Page
- Animated hero section with particle background
- Real-time sentiment preview
- Political heatmap visualization

### 2. Main Dashboard
- Overview metrics cards
- Sentiment trend charts
- Party comparison analytics
- Candidate leaderboard
- Word cloud visualization
- Real-time social feed

### 3. Map Analytics
- Interactive Zambia province map
- Color-coded sentiment visualization
- Province-level statistics

### 4. Alerts System
- Custom alert creation
- Sentiment spike detection
- Email/in-app notifications

### 5. Reports
- PDF export with charts
- CSV data export
- Historical trend analysis

### 6. Admin Panel
- User management
- Data source configuration
- Keyword tracking
- Alert management

## Data Sources

The platform aggregates data from:
- Twitter/X (via API)
- Facebook public pages
- News RSS feeds
- YouTube comments
- Reddit discussions

## Sentiment Analysis

Uses advanced NLP models to classify content as:
- Positive
- Negative
- Neutral

Tracks topics including:
- Economy
- Jobs
- Corruption
- Education
- Health
- Youth issues

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - See LICENSE file for details

## Support

For issues and questions, please open a GitHub issue.

## Acknowledgments

Built for monitoring digital political discourse in Zambia's democratic process.

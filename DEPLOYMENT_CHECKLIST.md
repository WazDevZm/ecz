# ZedPulse Elections Dashboard - Deployment Checklist

## 🚀 Pre-Deployment Checklist

### Environment Setup
- [ ] All environment variables configured
- [ ] Production MongoDB instance ready
- [ ] SSL certificates obtained
- [ ] Domain name configured
- [ ] CDN setup (optional)

### Security
- [ ] Change default admin password
- [ ] Generate strong JWT_SECRET
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for production domain
- [ ] Set up rate limiting
- [ ] Enable MongoDB authentication
- [ ] Review and update security headers
- [ ] Disable debug mode
- [ ] Remove development dependencies

### Backend
- [ ] Environment set to 'production'
- [ ] Database connection string updated
- [ ] API keys secured
- [ ] Error logging configured
- [ ] Health check endpoint tested
- [ ] Database indexes created
- [ ] Backup strategy in place

### Frontend
- [ ] Build optimized for production
- [ ] API URLs point to production
- [ ] Analytics configured (optional)
- [ ] Error tracking setup (Sentry, etc.)
- [ ] Assets optimized
- [ ] Service worker configured (optional)

### Sentiment Service
- [ ] Model downloaded and cached
- [ ] Python dependencies installed
- [ ] Service health check working
- [ ] Timeout configurations set

### Testing
- [ ] All features tested
- [ ] Authentication flow verified
- [ ] Real-time updates working
- [ ] Reports generation tested
- [ ] Mobile responsiveness checked
- [ ] Cross-browser testing done
- [ ] Load testing performed
- [ ] Security audit completed

## 📦 Deployment Options

### Option 1: Docker Deployment (Recommended)

#### Prerequisites
- Docker Engine 20+
- Docker Compose 2+
- 2GB+ RAM
- 10GB+ disk space

#### Steps
```bash
# 1. Clone repository
git clone <repository-url>
cd zedpulse

# 2. Configure environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp sentiment-service/.env.example sentiment-service/.env

# Edit .env files with production values

# 3. Build and start
docker-compose up --build -d

# 4. Seed database
docker-compose exec backend npm run seed

# 5. Verify services
docker-compose ps
docker-compose logs
```

#### Monitoring
```bash
# View logs
docker-compose logs -f

# Check service health
curl http://localhost:5000/health
curl http://localhost:8000/health

# Restart services
docker-compose restart

# Stop services
docker-compose down
```

### Option 2: VPS Deployment (Ubuntu/Debian)

#### Prerequisites
- Ubuntu 20.04+ or Debian 11+
- 2GB+ RAM
- 20GB+ disk space
- Root or sudo access

#### Steps

**1. Install Dependencies**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Python 3.9+
sudo apt install -y python3 python3-pip python3-venv

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2
```

**2. Setup Application**
```bash
# Clone repository
cd /var/www
sudo git clone <repository-url> zedpulse
cd zedpulse
sudo chown -R $USER:$USER .

# Backend setup
cd backend
cp .env.example .env
# Edit .env with production values
npm install --production
npm run seed
pm2 start src/server.js --name zedpulse-backend

# Sentiment service setup
cd ../sentiment-service
cp .env.example .env
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pm2 start "uvicorn main:app --host 0.0.0.0 --port 8000" --name zedpulse-sentiment

# Frontend setup
cd ../frontend
cp .env.example .env
# Edit .env with production values
npm install
npm run build

# Save PM2 processes
pm2 save
pm2 startup
```

**3. Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/zedpulse
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/zedpulse/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/zedpulse /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**4. Setup SSL with Let's Encrypt**
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Option 3: Cloud Platform Deployment

#### AWS Deployment
- **EC2**: Use Ubuntu instance with above VPS steps
- **ECS**: Use Docker containers
- **Elastic Beanstalk**: Deploy with Docker Compose
- **RDS**: Use managed MongoDB (DocumentDB)
- **S3 + CloudFront**: Host frontend static files

#### Google Cloud Platform
- **Compute Engine**: Use Ubuntu instance
- **Cloud Run**: Deploy containers
- **MongoDB Atlas**: Managed database
- **Cloud Storage + CDN**: Frontend hosting

#### DigitalOcean
- **Droplet**: Use Ubuntu instance
- **App Platform**: Deploy with Docker
- **Managed MongoDB**: Database hosting

#### Heroku
- **Web Dynos**: Backend and frontend
- **MongoDB Atlas**: Database
- **Heroku Scheduler**: Cron jobs

## 🔒 Security Hardening

### Firewall Configuration
```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### MongoDB Security
```bash
# Enable authentication
sudo nano /etc/mongod.conf

# Add:
security:
  authorization: enabled

# Create admin user
mongosh
use admin
db.createUser({
  user: "admin",
  pwd: "strong-password",
  roles: ["root"]
})
```

### Environment Variables
```bash
# Never commit .env files
# Use secrets management:
# - AWS Secrets Manager
# - Google Secret Manager
# - HashiCorp Vault
# - Docker secrets
```

### Regular Updates
```bash
# System updates
sudo apt update && sudo apt upgrade -y

# Node.js dependencies
npm audit fix

# Python dependencies
pip list --outdated
```

## 📊 Monitoring & Logging

### PM2 Monitoring
```bash
pm2 monit
pm2 logs
pm2 status
```

### Log Management
```bash
# Application logs
tail -f /var/www/zedpulse/backend/logs/app.log

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

### Monitoring Tools
- **PM2 Plus**: Process monitoring
- **New Relic**: Application performance
- **Datadog**: Infrastructure monitoring
- **Sentry**: Error tracking
- **LogRocket**: Frontend monitoring

## 🔄 Backup Strategy

### Database Backup
```bash
# Manual backup
mongodump --uri="mongodb://localhost:27017/zedpulse" --out=/backups/$(date +%Y%m%d)

# Automated backup (cron)
0 2 * * * mongodump --uri="mongodb://localhost:27017/zedpulse" --out=/backups/$(date +\%Y\%m\%d)
```

### Application Backup
```bash
# Backup application files
tar -czf /backups/zedpulse-$(date +%Y%m%d).tar.gz /var/www/zedpulse
```

### Restore
```bash
# Restore database
mongorestore --uri="mongodb://localhost:27017/zedpulse" /backups/20260429/zedpulse
```

## 🚨 Troubleshooting

### Service Not Starting
```bash
# Check logs
pm2 logs zedpulse-backend
docker-compose logs backend

# Check ports
sudo netstat -tulpn | grep :5000

# Restart services
pm2 restart all
docker-compose restart
```

### Database Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Test connection
mongosh

# Check network
telnet localhost 27017
```

### High Memory Usage
```bash
# Check processes
htop
pm2 monit

# Restart services
pm2 restart all

# Clear cache
pm2 flush
```

## 📈 Performance Optimization

### Database Optimization
- Create indexes on frequently queried fields
- Use aggregation pipelines
- Implement caching (Redis)
- Archive old data

### Frontend Optimization
- Enable gzip compression
- Use CDN for static assets
- Implement lazy loading
- Optimize images
- Enable browser caching

### Backend Optimization
- Use connection pooling
- Implement rate limiting
- Enable response compression
- Use clustering (PM2)
- Optimize queries

## ✅ Post-Deployment

- [ ] Verify all services running
- [ ] Test all features
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify backups working
- [ ] Update documentation
- [ ] Notify team
- [ ] Monitor for 24 hours

## 📞 Support Contacts

- **Technical Issues**: tech@zedpulse.zm
- **Security Issues**: security@zedpulse.zm
- **General Support**: support@zedpulse.zm

---

**Last Updated**: April 29, 2026

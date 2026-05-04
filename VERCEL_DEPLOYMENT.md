# Vercel Deployment Guide

This guide will help you deploy your ZedPulse Elections Dashboard to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. MongoDB Atlas account for production database (https://www.mongodb.com/cloud/atlas)
3. Vercel CLI installed (optional): `npm i -g vercel`

## Project Structure

This project uses Vercel's monorepo support with:
- **Frontend**: Next.js application (root directory)
- **Backend**: Express.js API (backend directory, served at `/_/backend/*`)

## Environment Variables Setup

### Required Environment Variables

Add these in your Vercel project settings (Settings → Environment Variables):

#### Backend Variables
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zedpulse
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
SENTIMENT_SERVICE_URL=https://your-sentiment-service-url.com
```

#### Optional API Keys (for data ingestion)
```
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
FACEBOOK_ACCESS_TOKEN=your-facebook-token
NEWS_API_KEY=your-news-api-key
ENABLE_DATA_INGESTION=false
```

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Connect Repository**
   - Go to https://vercel.com/new
   - Import your Git repository
   - Vercel will auto-detect Next.js

2. **Configure Project**
   - Framework Preset: **Next.js**
   - Root Directory: `./` (leave as default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

3. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add all required variables listed above
   - Make sure to add them for Production, Preview, and Development environments

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete

### Option 2: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## MongoDB Atlas Setup

1. **Create a Cluster**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create a free cluster
   - Choose a cloud provider and region

2. **Configure Network Access**
   - Go to Network Access
   - Add IP Address: `0.0.0.0/0` (allow from anywhere - Vercel uses dynamic IPs)

3. **Create Database User**
   - Go to Database Access
   - Add a new database user with read/write permissions
   - Save the username and password

4. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Add this as `MONGODB_URI` in Vercel environment variables

## Post-Deployment

### 1. Seed the Database

After first deployment, you'll need to seed your database:

```bash
# Option A: Run locally pointing to production DB
cd backend
MONGODB_URI="your-production-mongodb-uri" npm run seed

# Option B: Create a Vercel Function to seed (one-time use)
# Add a file: backend/api/seed.js
# Then visit: https://your-app.vercel.app/_/backend/api/seed
```

### 2. Update Frontend API URLs

Make sure your frontend is pointing to the correct backend URL:
- Local development: `http://localhost:5000`
- Production: `https://your-app.vercel.app/_/backend`

### 3. Test the Deployment

- Visit your app: `https://your-app.vercel.app`
- Test authentication
- Check API endpoints: `https://your-app.vercel.app/_/backend/health`

## Important Notes

### Limitations on Vercel

1. **WebSocket Support**: Vercel serverless functions don't support WebSockets (Socket.io)
   - Real-time features will need to use polling or be deployed separately
   - Consider using Vercel's Edge Functions or deploy Socket.io to a separate service (Railway, Render, etc.)

2. **Function Timeout**: Free tier has 10s timeout, Pro has 60s
   - Long-running operations should be optimized

3. **Cold Starts**: Serverless functions may have cold start delays

### Recommended Architecture for Production

For full real-time functionality:
1. Deploy Next.js frontend to Vercel
2. Deploy Express backend with Socket.io to Railway/Render/Heroku
3. Deploy sentiment service to a Python-compatible platform

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### API Routes Not Working
- Check that routes are prefixed with `/_/backend`
- Verify environment variables are set
- Check function logs in Vercel dashboard

### Database Connection Issues
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check connection string format
- Ensure database user has correct permissions

### Environment Variables Not Loading
- Make sure variables are added to the correct environment (Production/Preview/Development)
- Redeploy after adding new environment variables

## Monitoring

- **Vercel Analytics**: Automatically enabled for performance monitoring
- **Function Logs**: Available in Vercel dashboard under Deployments → Functions
- **Real-time Logs**: Use `vercel logs` CLI command

## Custom Domain (Optional)

1. Go to your project settings
2. Navigate to Domains
3. Add your custom domain
4. Update DNS records as instructed
5. Update `FRONTEND_URL` environment variable

## Support

- Vercel Documentation: https://vercel.com/docs
- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com/
- Next.js Documentation: https://nextjs.org/docs

## Quick Commands

```bash
# View deployment logs
vercel logs

# List deployments
vercel ls

# Remove deployment
vercel rm [deployment-url]

# Open project in browser
vercel open
```

# Quick Deploy to Vercel - 5 Minutes

The fastest way to get your app live on Vercel.

## Step 1: Prepare MongoDB (2 minutes)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster (if you don't have one)
3. Create a database user
4. Whitelist all IPs: `0.0.0.0/0`
5. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/zedpulse`)

## Step 2: Deploy to Vercel (2 minutes)

1. Go to https://vercel.com/new
2. Import your Git repository
3. Click "Deploy" (don't configure anything yet)
4. Wait for deployment to complete

## Step 3: Add Environment Variables (1 minute)

1. Go to your project settings in Vercel
2. Click "Environment Variables"
3. Add these variables:

```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/zedpulse
JWT_SECRET = your-super-secret-key-minimum-32-characters-long
NODE_ENV = production
FRONTEND_URL = https://your-app.vercel.app
```

4. Click "Save"
5. Redeploy: Go to Deployments → Click "..." → "Redeploy"

## Step 4: Seed Database (Optional)

Run locally pointing to production database:

```bash
cd backend
MONGODB_URI="your-production-uri" npm run seed
```

## Done! 🎉

Your app is live at: `https://your-app.vercel.app`

Test the API: `https://your-app.vercel.app/_/backend/health`

---

## Important Notes

⚠️ **WebSocket Limitation**: Socket.io real-time features won't work on Vercel serverless. For full real-time functionality, deploy the backend separately to Railway, Render, or Heroku.

## Next Steps

- [ ] Test login/registration
- [ ] Add custom domain (optional)
- [ ] Set up monitoring
- [ ] Configure sentiment service (if needed)

## Need Help?

See the full guide: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

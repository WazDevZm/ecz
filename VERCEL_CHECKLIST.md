# Vercel Deployment Checklist

Use this checklist to ensure a smooth deployment to Vercel.

## Pre-Deployment

### 1. Code Preparation
- [ ] All code is committed to Git repository
- [ ] Repository is pushed to GitHub/GitLab/Bitbucket
- [ ] No sensitive data (API keys, passwords) in code
- [ ] `.env` files are in `.gitignore`
- [ ] Build runs successfully locally: `npm run build`

### 2. Database Setup
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with read/write permissions
- [ ] Network access configured (0.0.0.0/0 for Vercel)
- [ ] Connection string obtained and tested
- [ ] Database name decided (e.g., `zedpulse`)

### 3. Environment Variables Prepared
- [ ] `MONGODB_URI` - MongoDB Atlas connection string
- [ ] `JWT_SECRET` - Strong secret key (min 32 characters)
- [ ] `NODE_ENV` - Set to "production"
- [ ] `FRONTEND_URL` - Will be your Vercel app URL
- [ ] `SENTIMENT_SERVICE_URL` - If using sentiment service
- [ ] Optional API keys for data ingestion

## Deployment Steps

### 4. Vercel Project Setup
- [ ] Logged into Vercel account
- [ ] Repository imported to Vercel
- [ ] Framework preset: Next.js selected
- [ ] Root directory: `./` (default)
- [ ] Build command: `npm run build` (default)

### 5. Environment Variables Configuration
- [ ] All environment variables added in Vercel dashboard
- [ ] Variables added for Production environment
- [ ] Variables added for Preview environment (optional)
- [ ] Variables added for Development environment (optional)

### 6. Initial Deployment
- [ ] Clicked "Deploy" button
- [ ] Build completed successfully
- [ ] No build errors in logs
- [ ] Deployment URL received

## Post-Deployment

### 7. Database Seeding
- [ ] Database seeded with initial data
- [ ] Test users created
- [ ] Parties and candidates data loaded
- [ ] Provinces data loaded

### 8. Testing
- [ ] Homepage loads correctly
- [ ] Login functionality works
- [ ] Registration functionality works
- [ ] API endpoints respond: `/_/backend/health`
- [ ] Dashboard displays data
- [ ] All pages accessible

### 9. Configuration Updates
- [ ] `FRONTEND_URL` updated with actual Vercel URL
- [ ] Frontend API calls pointing to correct backend URL
- [ ] CORS settings updated if needed
- [ ] Redeployed after configuration changes

### 10. Optional Enhancements
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate verified (automatic with Vercel)
- [ ] Analytics enabled
- [ ] Error monitoring setup (Sentry, etc.)

## Known Limitations

### WebSocket/Socket.io
- [ ] Aware that Socket.io won't work on Vercel serverless
- [ ] Real-time features disabled or using polling
- [ ] OR Socket.io backend deployed separately (Railway/Render)

### Alternatives for Real-time Features
If you need Socket.io:
- [ ] Option A: Deploy backend to Railway/Render/Heroku
- [ ] Option B: Use Vercel Edge Functions with WebSockets
- [ ] Option C: Implement polling instead of WebSockets
- [ ] Option D: Use Pusher/Ably for real-time features

## Troubleshooting Checklist

### If Build Fails
- [ ] Check build logs in Vercel dashboard
- [ ] Verify all dependencies in `package.json`
- [ ] Check Node.js version compatibility
- [ ] Ensure TypeScript errors are handled (ignoreBuildErrors)

### If API Routes Don't Work
- [ ] Verify routes use `/_/backend` prefix
- [ ] Check environment variables are set
- [ ] Review function logs in Vercel
- [ ] Test API endpoint directly: `https://your-app.vercel.app/_/backend/health`

### If Database Connection Fails
- [ ] Verify MongoDB Atlas IP whitelist
- [ ] Check connection string format
- [ ] Ensure database user has correct permissions
- [ ] Test connection string locally first

### If Frontend Can't Connect to Backend
- [ ] Check `NEXT_PUBLIC_API_URL` environment variable
- [ ] Verify CORS settings in backend
- [ ] Check browser console for errors
- [ ] Test API endpoint in browser/Postman

## Production Readiness

### Security
- [ ] JWT_SECRET is strong and unique
- [ ] No API keys exposed in frontend code
- [ ] CORS properly configured
- [ ] Helmet.js security headers enabled
- [ ] Rate limiting configured

### Performance
- [ ] Images optimized
- [ ] Compression enabled
- [ ] Database indexes created
- [ ] API responses cached where appropriate

### Monitoring
- [ ] Error logging configured
- [ ] Performance monitoring enabled
- [ ] Database monitoring setup
- [ ] Uptime monitoring configured

## Maintenance

### Regular Tasks
- [ ] Monitor Vercel function usage
- [ ] Check database storage usage
- [ ] Review error logs weekly
- [ ] Update dependencies monthly
- [ ] Backup database regularly

## Quick Reference

### Vercel URLs
- Dashboard: https://vercel.com/dashboard
- Docs: https://vercel.com/docs
- CLI: `npm i -g vercel`

### MongoDB Atlas URLs
- Dashboard: https://cloud.mongodb.com
- Docs: https://docs.atlas.mongodb.com

### Useful Commands
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls
```

## Support Resources

- Vercel Support: https://vercel.com/support
- MongoDB Support: https://support.mongodb.com
- Next.js Docs: https://nextjs.org/docs
- Project Issues: [Your GitHub Issues URL]

---

**Last Updated**: Before deployment
**Deployment Date**: _____________
**Deployed By**: _____________
**Production URL**: _____________

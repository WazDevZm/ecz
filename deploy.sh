#!/bin/bash

# Vercel Deployment Script - Frontend Only
# This script prepares and deploys the Next.js frontend to Vercel

echo "🚀 Starting Vercel Deployment Process..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
    echo "✅ Vercel CLI installed"
else
    echo "✅ Vercel CLI found"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔍 Checking for build errors..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "🌐 Deploying to Vercel..."
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 Deployment successful!"
        echo ""
        echo "Your app is now live on Vercel!"
    else
        echo ""
        echo "❌ Deployment failed. Check the error messages above."
        exit 1
    fi
else
    echo ""
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

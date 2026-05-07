#!/bin/bash

# ZedPulse Vercel Deployment Script
# This script helps you deploy to Vercel with proper checks

echo "🚀 ZedPulse Vercel Deployment Helper"
echo "===================================="
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found"
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Vercel CLI is installed"
echo ""

# Check if .env.example exists
if [ ! -f ".env.example" ]; then
    echo "⚠️  Warning: .env.example not found"
fi

# Check if vercel.json exists
if [ ! -f "vercel.json" ]; then
    echo "❌ Error: vercel.json not found"
    echo "Please ensure you have the Vercel configuration file"
    exit 1
fi

echo "✅ Configuration files found"
echo ""

# Prompt for deployment type
echo "Select deployment type:"
echo "1) Preview deployment (test)"
echo "2) Production deployment"
echo ""
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        echo ""
        echo "🔍 Deploying to preview..."
        vercel
        ;;
    2)
        echo ""
        echo "⚠️  WARNING: This will deploy to PRODUCTION"
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            echo ""
            echo "🚀 Deploying to production..."
            vercel --prod
        else
            echo "❌ Deployment cancelled"
            exit 0
        fi
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Check your deployment in the Vercel dashboard"
echo "2. Verify environment variables are set"
echo "3. Test the API endpoint: https://your-app.vercel.app/_/backend/health"
echo "4. Seed your database if this is the first deployment"
echo ""
echo "📖 For more information, see VERCEL_DEPLOYMENT.md"

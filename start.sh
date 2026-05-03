#!/bin/bash

# ZedPulse Elections Dashboard - Quick Start Script
# This script helps you get started with the application quickly

set -e

echo "🚀 ZedPulse Elections Dashboard - Quick Start"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker and Docker Compose found"
    DOCKER_AVAILABLE=true
else
    echo -e "${YELLOW}⚠${NC} Docker not found. Will use manual setup."
    DOCKER_AVAILABLE=false
fi

# Ask user for setup method
echo ""
echo "Choose setup method:"
echo "1) Docker (Recommended - Easiest)"
echo "2) Manual Setup (Requires Node.js, Python, MongoDB)"
echo ""
read -p "Enter choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
    if [ "$DOCKER_AVAILABLE" = false ]; then
        echo -e "${RED}✗${NC} Docker is not installed. Please install Docker first."
        echo "Visit: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    echo ""
    echo "🐳 Starting with Docker..."
    echo ""
    
    # Create .env files if they don't exist
    if [ ! -f backend/.env ]; then
        echo "Creating backend/.env..."
        cp backend/.env.example backend/.env
    fi
    
    if [ ! -f frontend/.env ]; then
        echo "Creating frontend/.env..."
        cp frontend/.env.example frontend/.env
    fi
    
    if [ ! -f sentiment-service/.env ]; then
        echo "Creating sentiment-service/.env..."
        cp sentiment-service/.env.example sentiment-service/.env
    fi
    
    echo ""
    echo "Building and starting containers..."
    docker-compose up --build -d
    
    echo ""
    echo -e "${GREEN}✓${NC} Containers started successfully!"
    echo ""
    echo "Waiting for services to be ready..."
    sleep 10
    
    echo ""
    echo "Seeding database..."
    docker-compose exec backend npm run seed
    
    echo ""
    echo -e "${GREEN}✓${NC} Setup complete!"
    echo ""
    echo "Access the application:"
    echo "  Frontend: http://localhost:5173"
    echo "  Backend API: http://localhost:5000"
    echo "  Sentiment Service: http://localhost:8000"
    echo ""
    echo "Default credentials:"
    echo "  Email: admin@zedpulse.zm"
    echo "  Password: Admin@2026"
    echo ""
    echo -e "${YELLOW}⚠ Remember to change the default password!${NC}"
    
elif [ "$choice" = "2" ]; then
    echo ""
    echo "📦 Manual Setup"
    echo ""
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}✗${NC} Node.js not found. Please install Node.js 18+"
        exit 1
    fi
    echo -e "${GREEN}✓${NC} Node.js found: $(node --version)"
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        echo -e "${RED}✗${NC} Python not found. Please install Python 3.9+"
        exit 1
    fi
    echo -e "${GREEN}✓${NC} Python found: $(python3 --version)"
    
    # Check MongoDB
    if ! command -v mongosh &> /dev/null && ! command -v mongo &> /dev/null; then
        echo -e "${YELLOW}⚠${NC} MongoDB CLI not found. Make sure MongoDB is running."
    else
        echo -e "${GREEN}✓${NC} MongoDB CLI found"
    fi
    
    echo ""
    echo "Setting up Backend..."
    cd backend
    
    if [ ! -f .env ]; then
        cp .env.example .env
        echo "Created backend/.env - Please configure it"
    fi
    
    npm install
    echo -e "${GREEN}✓${NC} Backend dependencies installed"
    
    echo ""
    echo "Seeding database..."
    npm run seed
    
    echo ""
    echo "Starting backend in background..."
    npm run dev &
    BACKEND_PID=$!
    cd ..
    
    echo ""
    echo "Setting up Sentiment Service..."
    cd sentiment-service
    
    if [ ! -f .env ]; then
        cp .env.example .env
    fi
    
    if [ ! -d venv ]; then
        python3 -m venv venv
    fi
    
    source venv/bin/activate
    pip install -r requirements.txt
    echo -e "${GREEN}✓${NC} Sentiment service dependencies installed"
    
    echo ""
    echo "Starting sentiment service in background..."
    uvicorn main:app --reload &
    SENTIMENT_PID=$!
    cd ..
    
    echo ""
    echo "Setting up Frontend..."
    cd frontend
    
    if [ ! -f .env ]; then
        cp .env.example .env
    fi
    
    npm install
    echo -e "${GREEN}✓${NC} Frontend dependencies installed"
    
    echo ""
    echo "Starting frontend..."
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    echo ""
    echo -e "${GREEN}✓${NC} All services started!"
    echo ""
    echo "Access the application:"
    echo "  Frontend: http://localhost:5173"
    echo "  Backend API: http://localhost:5000"
    echo "  Sentiment Service: http://localhost:8000"
    echo ""
    echo "Default credentials:"
    echo "  Email: admin@zedpulse.zm"
    echo "  Password: Admin@2026"
    echo ""
    echo "Process IDs (for stopping):"
    echo "  Backend: $BACKEND_PID"
    echo "  Sentiment: $SENTIMENT_PID"
    echo "  Frontend: $FRONTEND_PID"
    echo ""
    echo "To stop all services, run:"
    echo "  kill $BACKEND_PID $SENTIMENT_PID $FRONTEND_PID"
    
else
    echo -e "${RED}✗${NC} Invalid choice"
    exit 1
fi

echo ""
echo "📚 For more information, see:"
echo "  - README.md: Project overview"
echo "  - SETUP.md: Detailed setup guide"
echo "  - FEATURES.md: Feature documentation"
echo ""
echo "Happy monitoring! 🎉"

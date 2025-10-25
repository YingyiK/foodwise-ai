# FoodWise AI - Intelligent Food Decision Platform

## Project Overview

FoodWise AI is an end-to-end intelligent food decision platform that provides users with:

- 🍎 Personalized food recommendations
- 🏥 Health and preference-based dietary advice  
- 🍽️ Restaurant recommendations integrated with Yelp data
- 🛒 One-stop ingredient procurement solutions

## Core Value

Complete intelligent decision loop from "what to eat" to "where to eat" to "where to buy"

## System Architecture

```
User Interface Layer (React + D3.js)
    ↓
API Gateway Layer (AWS API Gateway)
    ↓
Multi-Agent Collaboration Layer (Lambda)
    ↓
Data & External Services Layer (S3, Yelp API, Google Maps)
```

## Core Features

### 1. Intelligent Food Recommendation Engine
- Smart search based on 5K+ food database
- Health assessment and nutritional analysis
- Target accuracy: 89%

### 2. Personal Preference Analysis System
- User health profile management
- Taste preference learning
- Dietary restriction filtering

### 3. Yelp Restaurant Recommendation Engine
- Intelligent restaurant matching
- Comprehensive rating algorithm
- Navigation integration

### 4. Ingredient Procurement Solutions
- Smart shopping list generation
- Organic supermarket recommendations
- One-click online ordering

## Tech Stack

### Frontend
- React 18
- TypeScript
- D3.js (Data Visualization)
- Material-UI
- React Router

### Backend
- Node.js
- Express.js
- AWS Lambda
- AWS API Gateway
- AWS S3

### AI/ML
- Anthropic Claude-3-Sonnet
- Multi-agent collaboration system
- RAG (Retrieval-Augmented Generation)

### External Integrations
- Yelp Fusion API
- Google Maps Places API
- Instacart API
- Amazon Fresh API

## Quick Start

```bash
# Install dependencies
npm install

# Start development environment
npm run dev

# Build for production
npm run build

# Deploy to AWS
npm run deploy
```

## Environment Configuration

Create `.env` file:

```env
# Anthropic Claude
ANTHROPIC_API_KEY=your_anthropic_api_key

# Yelp
YELP_API_KEY=your_yelp_api_key

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# AWS
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-west-2

# Database
MONGODB_URI=mongodb://localhost:27017/foodwise
```

## Project Structure

```
FoodWise/
├── frontend/          # React frontend application
├── backend/           # Node.js backend service
├── agents/            # AI agent modules
├── data/              # Data files and database
├── docs/              # Project documentation
└── tests/             # Test files
```

## Development Plan

- [x] Project structure setup
- [ ] Multi-agent AI system
- [ ] Food recommendation engine
- [ ] Personal preference analysis
- [ ] Yelp restaurant recommendations
- [ ] Ingredient procurement solutions
- [ ] React frontend interface
- [ ] AWS infrastructure

## Contributing

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License
# Overview

This is a Financial Independence (FI) Timeline Calculator - a full-stack web application that helps users calculate how long it will take to reach their financial independence goals. The application features an interactive React frontend with advanced visualizations and a FastAPI backend for data processing and storage.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 19 with Create React App as the foundation
- **Styling**: Tailwind CSS for utility-first styling with custom CSS for advanced components
- **Build System**: CRACO (Create React App Configuration Override) for webpack customization
- **Visualization**: Chart.js for financial data charts and custom particle systems for enhanced UI
- **State Management**: React hooks (useState, useEffect) for local component state
- **Deployment**: Configured for development on port 5000 with hot reload capabilities

## Backend Architecture
- **Framework**: FastAPI for high-performance API development
- **Server**: Uvicorn ASGI server for production deployment
- **Data Models**: Pydantic for request/response validation and serialization
- **API Structure**: RESTful design with `/api` prefix routing
- **Error Handling**: Built-in FastAPI exception handling with custom middleware

## Data Storage Solutions
- **Primary Database**: MongoDB with Motor (async driver) for document storage
- **Connection Management**: AsyncIOMotorClient for non-blocking database operations
- **Schema Design**: Flexible document-based storage for financial calculations and user data
- **Fallback**: Application works without database connection for basic calculations

## Authentication and Authorization
- **JWT Support**: Python-jose library integrated for token-based authentication
- **Password Security**: Passlib for secure password hashing
- **OAuth Integration**: Requests-oauthlib for third-party authentication flows
- **Security**: Cryptography library for additional security features

## Development and Testing
- **Testing Framework**: Pytest for comprehensive backend testing
- **Code Quality**: Black, isort, flake8, and mypy for code formatting and linting
- **API Testing**: Dedicated backend test suite with requests library
- **Development Tools**: Python-dotenv for environment configuration

# External Dependencies

## Core Technologies
- **FastAPI**: Modern Python web framework for building APIs
- **React**: Frontend JavaScript library for user interfaces
- **MongoDB**: NoSQL database for flexible data storage
- **Chart.js**: JavaScript charting library for financial visualizations

## Cloud Services
- **AWS SDK**: Boto3 integration for potential cloud services
- **Database Hosting**: MongoDB Atlas or self-hosted MongoDB instance

## Development Tools
- **Package Management**: Yarn for frontend dependencies, pip for backend
- **Build Tools**: Webpack (via CRACO) for frontend bundling
- **CSS Framework**: Tailwind CSS for responsive design

## Visualization and Animation
- **Anime.js**: Advanced animation library for smooth UI transitions
- **Custom Particle Systems**: Canvas-based effects for enhanced user experience
- **Responsive Charts**: Dynamic financial data visualization with Chart.js

## Data Processing
- **Pandas**: Data manipulation and analysis for financial calculations
- **NumPy**: Numerical computing for complex mathematical operations
- **Financial Modeling**: Custom algorithms for FI timeline calculations

## API and Networking
- **Axios**: HTTP client for frontend API communication
- **CORS**: Cross-origin resource sharing for frontend-backend communication
- **Request Validation**: Pydantic models for type-safe API contracts
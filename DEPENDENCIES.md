# AIVest Banking Application - Dependency Manifest
# Generated on August 28, 2025
# This file provides detailed dependency information for deployment platforms

## Project Structure
- Root: Monorepo configuration
- Backend: Node.js/Express API server
- Frontend: React 18 + Vite application

## Runtime Requirements
Node.js: >=18.0.0
npm: >=8.0.0

## Backend Dependencies (./backend/package.json)
### Production
cors: ^2.8.5          # Cross-Origin Resource Sharing middleware
express: ^4.19.0      # Web application framework

## Frontend Dependencies (./frontend/package.json)
### Production
bootstrap: ^5.3.3           # CSS framework for responsive design
react: ^18.2.0             # JavaScript library for building user interfaces
react-dom: ^18.2.0         # React package for working with the DOM
react-router-dom: ^6.30.1  # Declarative routing for React applications

### Development
@vitejs/plugin-react: ^4.0.0  # Official Vite plugin for React
vite: ^5.0.0                  # Next generation frontend build tool

## Root Dependencies (./package.json)
### Production
cors: ^2.8.5          # Shared backend dependency
express: ^4.19.0      # Shared backend dependency

### Development
concurrently: ^8.2.2  # Run multiple commands concurrently

## Build Process
1. install:deps - Installs all dependencies (frontend + backend)
2. build:frontend - Builds React application for production
3. build - Full build process (install + build frontend)

## Deployment Commands
Build Command: npm run build
Start Command: npm start

## Environment Variables
NODE_ENV=production (for production deployment)
PORT=3000 (default backend port)

## Static File Serving
The backend server (server.js) serves the built React application in production mode.
Frontend build output is located at: ./frontend/dist/

## API Endpoints
GET /api/clients - Fetch all clients
POST /api/clients - Create new client
PUT /api/clients/:id - Update client
DELETE /api/clients/:id - Delete client

## Development Setup
npm run dev - Runs both frontend (Vite dev server) and backend (Express server) concurrently
Frontend: http://localhost:5173
Backend: http://localhost:3000

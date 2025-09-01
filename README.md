# AIVest Banking Client Management System

A comprehensive relationship management platform designed for banking professionals to manage high net worth (HNW) clients, track portfolios, and receive AI-powered investment recommendations.

> **📱 Mobile Users**: Tap any section below to jump directly to that topic.

## 📚 Table of Contents

1. [🌟 Features](#-features)
2. [🏗️ System Architecture](#-system-architecture)
3. [📋 Prerequisites](#-prerequisites)
4. [🚀 Quick Start Guide](#-quick-start-guide)
5. [📖 User Guide](#-user-guide)
6. [🎯 How to Use the Application](#-how-to-use-the-application)
7. [⚡ App Features & Capabilities](#-app-features--capabilities)
8. [⚠️ Limitations & Known Issues](#-limitations--known-issues)
9. [🛠️ Troubleshooting](#-troubleshooting)
10. [📁 Project Structure](#-project-structure)
11. [🎨 Key Technologies](#-key-technologies)
12. [🔧 Development Features](#-development-features)
13. [📞 Support](#-support)

---

## 🌟 Features

- **Client Management**: View, search, and manage high net worth client portfolios
- **Advanced Search & Filtering**: Filter clients by AUM, domicile, risk profile, and segments
- **Portfolio Analytics**: Detailed portfolio breakdowns with performance metrics
- **AI Recommendations**: Intelligent investment suggestions with detailed analysis
- **Client Actions**: Schedule calls, send messages, and manage client relationships
- **Professional Interface**: Modern, responsive design optimized for banking professionals
- **Sample Data Mode**: Run application using only sample data without any backend dependencies

## 🏗️ System Architecture

### Data Flow Architecture

```
User Opens App
       ↓
[Sample Data Loads Immediately] ← Fast, always works
       ↓
[Attempt Backend Connection]
       ↓
   ┌─────────┬─────────┐
   ✅ Success     ❌ Fails
       ↓             ↓
[Use Backend]  [Keep Sample]
[Real Data]    [Offline Mode]
```

### Component Architecture

```
┌─────────────────────────────────────┐
│            Frontend (React)         │
│  ┌─────────────────────────────────┐│
│  │     User Interface Layer        ││
│  │  • Client Dashboard             ││
│  │  • Portfolio Views              ││
│  │  • AI Recommendations           ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │     Data Management Layer       ││
│  │  • API Calls                    ││
│  │  • Sample Data Fallback         ││
│  │  • State Management             ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
                    ↕ HTTP/REST API
┌─────────────────────────────────────┐
│           Backend (Flask)           │
│  ┌─────────────────────────────────┐│
│  │       API Endpoints             ││
│  │  • /api/clients                 ││
│  │  • /api/recommendations         ││
│  │  • /api/portfolios              ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │     Business Logic Layer        ││
│  │  • Client Management            ││
│  │  • AI Recommendation Engine     ││
│  │  • Portfolio Calculations       ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │      Data Storage Layer         ││
│  │  • In-Memory Arrays             ││
│  │  • Sample Client Data           ││
│  │  • Dynamic Recommendations      ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

### Deployment Architecture

#### Development Environment (Local)
```
Your Computer
├── Frontend Server (Port 5173)
│   └── React App with Hot Reload
└── Backend Server (Port 5000)
    └── Express API with Live Data
    
Access: http://localhost:5173
```

#### Production Environment (Hosted)
```
Render Cloud Platform
├── Single Container
│   ├── Frontend (Static Files)
│   └── Backend (Express Server)
│
Access: https://aivest-7otb.onrender.com
```

### Data Sources Hierarchy

```
┌─────────────────────────────┐
│     Primary Data Source     │
│    Backend In-Memory Data   │  ← Real-time, Dynamic
│  (When backend is running)  │
└─────────────────────────────┘
                ↓ Fallback
┌─────────────────────────────┐
│     Backup Data Source      │
│   Frontend Sample Data      │  ← Static, Always Available
│    (When backend fails)     │
└─────────────────────────────┘
                ↓ Fallback
┌─────────────────────────────┐
│    Browser Local Storage    │
│     (Saved searches,        │  ← User preferences
│      user preferences)      │
└─────────────────────────────┘
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 16.0 or higher)
- **npm** (usually comes with Node.js)
- **Git** (for cloning the repository)

### ✅ Check if you have these installed:
```bash
node --version
npm --version
git --version
```

## 🚀 Quick Start Guide

### Step 1: Download the Application

1. **Clone the repository** from GitHub:
   ```bash
   git clone https://github.com/Jiayao2006/AIVest.git
   ```

2. **Navigate to the project directory**:
   ```bash
   cd AIVest
   ```

### Step 2: Install Dependencies

1. **Install frontend dependencies**:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

2. **Install backend dependencies (Python Flask)**:
   ```bash
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

### Step 3: Start the Application

You'll need to run both the backend server and frontend application. Open **two separate terminal/command prompt windows**:

#### Terminal 1 - Start the Backend Server (Flask):
```bash
cd backend
python app.py
```

You should see:
```
🎉 =================================
🚀 AIVest Banking Server Started (Flask)!
🎉 =================================
🌐 Server URL: http://localhost:5000
📊 Initial Client Count: 10
🤖 Initial Recommendations: 3
💼 Available Portfolios: 3
🎯 Ready for connections!
=================================
```

#### Terminal 2 - Start the Frontend Application:
```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.4.19  ready in 169 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 4: Access the Application

1. **Open your web browser**
2. **Navigate to**: `http://localhost:5173`
3. **You should see the AIVest Banking dashboard** with a list of high net worth clients

## 📖 User Guide

### Getting Started - Step by Step

#### For First-Time Users:

1. **📁 Download & Setup**
   - Clone the repository from GitHub
   - Install Node.js dependencies for both frontend and backend
   - This is a one-time setup process

2. **🚀 Running the App**
   - Open TWO terminal windows
   - Start backend server first (Terminal 1): `cd backend && python app.py`
   - Start frontend app second (Terminal 2): `cd frontend && npm run dev`
   - Both must run simultaneously for full functionality

3. **🌐 Accessing the App**
   - **Local Development**: `http://localhost:5173` (your computer only)
   - **Mobile/Network**: `http://[your-ip]:5173` (accessible from other devices)
   - **Production**: `https://aivest-7otb.onrender.com` (hosted online)

#### Understanding the Interface:

1. **Main Dashboard**: Shows all clients with search and filter options
2. **Client Cards**: Click any client to see detailed portfolio information
3. **AI Recommendations**: View and manage investment suggestions
4. **Action Buttons**: Add clients, schedule calls, send messages

#### Data Connection Status:

- **Green Badge "API Connected"**: Real backend data, full functionality
- **Yellow Badge "Local Data"**: Sample data mode, limited functionality

### Running Options Explained:

#### Option 1: Full Local Development
```bash
# Terminal 1 - Backend (Flask)
cd backend
python app.py

# Terminal 2 - Frontend  
cd frontend
npm run dev
```
- ✅ **Best for**: Development, testing, customization
- ✅ **Features**: All features work, real-time data updates
- ❌ **Limitation**: Requires both terminals running

#### Option 2: Demo Mode (Frontend Only)
```bash
# Single Terminal
cd frontend
npm run dev
```
- ✅ **Best for**: Quick demos, presentations
- ✅ **Features**: UI works perfectly with sample data
- ❌ **Limitation**: No real data updates, no backend features

#### Option 3: Production (Hosted)
- ✅ **Best for**: Sharing with others, mobile access
- ✅ **Features**: Works anywhere with internet
- ❌ **Limitation**: If you're not running local backend, some features won't work

## 🎯 How to Use the Application

### 📊 Client Management Dashboard
- **View Clients**: Browse the complete list of high net worth clients
- **Search**: Use the search bar to find specific clients by name, segments, or description
- **Filter**: Apply filters for AUM range, domicile, risk profile, and client segments
- **Sort**: Click column headers to sort by different criteria

### 👤 Client Details
- **Click on any client** to view detailed information
- **Portfolio Overview**: See asset allocation and performance metrics
- **AI Recommendations**: Review personalized investment suggestions
- **Client Actions**: Use the dropdown menu (⋮) to:
  - Schedule a call
  - Send a message
  - Delete client (if needed)

### ➕ Adding New Clients
1. **Click the "Add New Client" button**
2. **Fill in the client information**:
   - Name and phone number
   - Assets Under Management (AUM)
   - Domicile and risk profile
   - Client segments and key contacts
3. **Click "Add Client"** to save

### 🔍 Advanced Features
- **AI Recommendations**: Click on recommendation cards to see detailed analysis
- **Portfolio Analytics**: View comprehensive portfolio breakdowns
- **Search & Filter**: Combine multiple filters for precise client targeting

## ⚡ App Features & Capabilities

### 🎯 Core Banking Features
- **👥 Client Management**: Complete HNW client database with portfolio tracking
- **💰 Portfolio Analytics**: Real-time AUM tracking, asset allocation, performance metrics
- **🤖 AI Investment Engine**: Smart recommendations based on risk profiles and market conditions
- **📊 Advanced Filtering**: Filter by AUM range, domicile, risk profile, client segments
- **🔍 Smart Search**: Find clients by name, description, or any text field
- **📱 Mobile Ready**: Responsive design works on desktop, tablet, and mobile

### 🚀 Technical Capabilities
- **⚡ Instant Loading**: Sample data loads immediately for fast user experience
- **🔄 Real-time Sync**: Backend data updates without page refresh
- **💾 Offline Mode**: Works even when backend is unavailable
- **🌐 Network Access**: Can be accessed from mobile devices on same network
- **🎨 Professional UI**: Banking-grade interface with Bootstrap styling
- **📈 Live Updates**: Recommendation status changes reflect immediately

### 🛡️ Reliability Features
- **🔒 Graceful Degradation**: App never breaks, always shows something useful
- **📋 Sample Data Fallback**: Comprehensive demo data when backend is unavailable
- **⚠️ Clear Status Indicators**: Always know if you're using live or sample data
- **🔄 Auto-retry Logic**: Automatically attempts to reconnect to backend
- **📱 Cross-platform**: Works on Windows, Mac, Linux, iOS, Android browsers

## ⚠️ Limitations & Known Issues

### 📋 Quick Navigation:
- [🌐 Network Dependencies](#-network-dependencies)
- [💾 Data Persistence](#-data-persistence-limitations)
- [🔄 Backend Dependencies](#-backend-dependencies)
- [📱 Mobile Access](#-mobile-access-limitations)
- [🔧 Development](#-development-limitations)
- [🎯 Feature Scope](#-feature-scope-limitations)

---

### 🌐 Network Dependencies

#### **Hosted Website Limitation** (Most Important)
**Simple Explanation**: If you're using the hosted website (`https://aivest-7otb.onrender.com`) but NOT running the backend on your computer, some features won't work properly.

**Why This Happens**:
- The hosted website tries to get live data from YOUR computer's backend server
- When you close VS Code or your computer, that connection is lost
- The website falls back to sample data, but some advanced features are limited

**Solutions**:
```
Problem: Hosted site not getting live data
✅ Solution 1: Run backend locally while using hosted site
✅ Solution 2: Use local development setup instead
✅ Solution 3: Use demo mode (sample data only)
```

### 💾 Data Persistence Limitations

#### **No Permanent Database**
- **Issue**: All data resets when backend server restarts
- **Impact**: New clients, modified recommendations don't persist
- **Workaround**: Data exists during session only
- **Future**: Can be upgraded to use PostgreSQL, MongoDB, etc.

#### **In-Memory Storage Only**
- **Issue**: No file or database storage currently implemented
- **Impact**: Can't save data between sessions
- **Workaround**: Use browser localStorage for some features
- **Future**: Easy to add file export/import (Excel, CSV)

### 🔄 Backend Dependencies

#### **Dual Server Requirement**
- **Issue**: Need both frontend AND backend running for full features
- **Impact**: More complex setup than single-file apps
- **Workaround**: Demo mode works with frontend only
- **Benefit**: More realistic enterprise architecture

#### **Port Conflicts**
- **Issue**: Ports 5000 and 5173 must be available
- **Impact**: May conflict with other development tools
- **Workaround**: System auto-selects alternative ports
- **Solution**: Check terminal output for actual URLs

### 📱 Mobile Access Limitations

#### **Network Configuration Required**
- **Issue**: Mobile access requires --host flag for Vite
- **Impact**: Extra step for mobile testing
- **Workaround**: Use `npx vite --host` instead of `npm run dev`
- **Benefit**: Once set up, works great on mobile

### 🔧 Development Limitations

#### **No Hot Reload for Backend**
- **Issue**: Backend changes require manual restart
- **Impact**: Slower backend development cycle
- **Workaround**: Use nodemon for auto-restart
- **Frontend**: Hot reload works perfectly

### 🎯 Feature Scope Limitations

#### **No User Authentication**
- **Current**: Single-user application
- **Impact**: No login system or user separation
- **Future**: Can add JWT authentication, role-based access

#### **No Real Market Data**
- **Current**: Simulated portfolio values and recommendations
- **Impact**: Not connected to live market feeds
- **Future**: Can integrate with financial APIs (Bloomberg, Alpha Vantage)

#### **No Email/SMS Integration**
- **Current**: Message and call scheduling are simulated
- **Impact**: No actual communication sent
- **Future**: Can integrate with Twilio, SendGrid, etc.

### 💡 Understanding the Limitations

**Most limitations are by design** to keep the demo simple and self-contained. The architecture is built to easily upgrade to enterprise features:

- **Database**: Replace in-memory arrays with PostgreSQL
- **Authentication**: Add JWT tokens and user management
- **Real Data**: Connect to financial market APIs
- **Communication**: Add real email/SMS capabilities
- **File Storage**: Add document upload and management

**The current system is perfect for**:
- ✅ Demonstrating banking UI/UX concepts
- ✅ Prototyping client management workflows
- ✅ Testing responsive design on mobile devices
- ✅ Showcasing AI recommendation interfaces

## 🛠️ Troubleshooting

### Common Issues:

1. **"Error Loading Client" or "Failed to fetch"**
   - Ensure the backend server is running on port 5000
   - Check that both terminals are running simultaneously
   - The application has offline fallback, so it will still work with sample data

2. **Port Already in Use**
   - If port 5173 or 5000 is busy, the system will automatically try alternative ports
   - Check the terminal output for the actual URLs

3. **npm install fails**
   - Try deleting `node_modules` folders and running `npm install` again
   - Ensure you have the latest version of Node.js

### 📊 Testing the System
- Visit `http://localhost:5000/api/health` to test backend connectivity
- Visit `http://localhost:5000/api/debug/network` for diagnostic information

## 📁 Project Structure

```
AIVest/
├── frontend/           # React + Vite frontend application
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   └── package.json   # Frontend dependencies
├── backend/           # Python + Flask backend server
│   ├── app.py         # Main Flask server file
│   ├── requirements.txt # Python dependencies
│   └── package.json   # Legacy Node.js config (for Render)
└── README.md          # This file
```

## 🎨 Key Technologies

- **Frontend**: React 18, Vite, Bootstrap 5, React Router
- **Backend**: Python 3.12, Flask 3.0, Flask-CORS
- **Data**: In-memory storage (easily replaceable with database)
- **Styling**: Bootstrap with custom banking theme

## 🔧 Development Features

- **Hot Reload**: Frontend automatically updates when you make changes
- **Enhanced Logging**: Comprehensive debugging information in backend terminal
- **Error Handling**: Graceful fallbacks and user-friendly error messages
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 📞 Support

If you encounter any issues:
1. Check that both backend and frontend servers are running
2. Verify all dependencies are installed correctly
3. Check the terminal outputs for error messages
4. The application includes comprehensive logging for debugging

---

**Ready to manage your high net worth clients with AIVest!** 🏦✨

---

### 🔝 [Back to Top](#aivest-banking-client-management-system)


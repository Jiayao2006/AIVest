# AIVest Banking Client Management System

A comprehensive relationship management platform designed for banking professionals to manage high net worth (HNW) clients, track portfolios, and receive AI-powered investment recommendations.

## 🌟 Features

- **Client Management**: View, search, and manage high net worth client portfolios
- **Advanced Search & Filtering**: Filter clients by AUM, domicile, risk profile, and segments
- **Portfolio Analytics**: Detailed portfolio breakdowns with performance metrics
- **AI Recommendations**: Intelligent investment suggestions with detailed analysis
- **Client Actions**: Schedule calls, send messages, and manage client relationships
- **Professional Interface**: Modern, responsive design optimized for banking professionals

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

2. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   cd ..
   ```

### Step 3: Start the Application

You'll need to run both the backend server and frontend application. Open **two separate terminal/command prompt windows**:

#### Terminal 1 - Start the Backend Server:
```bash
cd backend
node server.js
```

You should see:
```
🎉 =================================
🚀 AIVest Banking Server Started!
🎉 =================================
🌐 Server URL: http://localhost:5000
📊 Initial Client Count: 10
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
├── backend/           # Node.js + Express backend server
│   ├── server.js      # Main server file
│   └── package.json   # Backend dependencies
└── README.md          # This file
```

## 🎨 Key Technologies

- **Frontend**: React 18, Vite, Bootstrap 5, React Router
- **Backend**: Node.js, Express, CORS
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


# Deploying Flask Backend to Render

## Current Status
- ✅ **Local Flask Backend**: Working perfectly with all API endpoints
- ⚠️ **Hosted Backend**: Still running old Express.js version
- 🎯 **Goal**: Update Render deployment to use new Flask backend

## Steps to Deploy Flask Backend to Render

### 1. Update Render Service Settings

In your Render dashboard (https://dashboard.render.com):

1. **Go to your AIVest service**
2. **Click "Settings"**
3. **Update Build Command**:
   ```bash
   cd backend && pip install -r requirements.txt
   ```

4. **Update Start Command**:
   ```bash
   cd backend && python app.py
   ```

5. **Update Environment Variables**:
   - `PYTHON_VERSION`: `3.12.5`
   - `PORT`: `5000` (if not already set)

### 2. Deploy the New Version

1. **Push your changes to GitHub**:
   ```bash
   git add .
   git commit -m "Migrate backend from Express.js to Flask"
   git push origin main
   ```

2. **Trigger deployment** in Render dashboard or it will auto-deploy

### 3. Update Frontend Configuration

Once Flask is deployed, update `frontend/.env`:
```bash
# Change from:
VITE_API_BASE_URL=http://localhost:5000

# To:
VITE_API_BASE_URL=https://aivest-7otb.onrender.com
```

## Current Working Setup

**For now, your app works perfectly with:**
- ✅ **Frontend**: http://localhost:5173 (React + Vite)
- ✅ **Backend**: http://localhost:5000 (Flask)
- ✅ **All Features**: Client management, AI recommendations, portfolio views

## Verification Commands

Test local Flask backend:
```bash
curl http://localhost:5000/api/clients
```

Test hosted backend (after deployment):
```bash
curl https://aivest-7otb.onrender.com/api/clients
```

## Files Ready for Deployment

- ✅ `backend/app.py` - Complete Flask server
- ✅ `backend/requirements.txt` - Python dependencies
- ✅ `backend/package.json` - Updated for Flask (legacy compatibility)
- ✅ `frontend/.env` - API configuration
- ✅ `README.md` - Updated documentation

Your Flask migration is complete locally. Just deploy to Render to complete the transition!

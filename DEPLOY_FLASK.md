# Render Deployment Settings for Flask

## Build Command
pip install -r backend/requirements.txt && npm run build:frontend

## Start Command  
python backend/app.py

## Environment Variables (Render Dashboard)
- FLASK_ENV=production
- NODE_ENV=production
- PORT=5000 (auto-set by Render)

## Deploy Process
1. Push Flask backend to GitHub
2. Render automatically detects Python app
3. Uses build command to install Python deps + build frontend
4. Starts Flask server which serves both API and static files
5. Frontend calls relative URLs (same-origin) in production

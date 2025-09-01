# Deploying AIVest to Render with Flask Backend

This guide covers deploying the AIVest application to Render using the Python Flask backend.

## Prerequisites

1. A [Render](https://render.com) account
2. Your AIVest repository pushed to GitHub

## Deployment Options

You can deploy AIVest to Render in two ways:

### Option 1: Using render.yaml (Recommended)

This repository includes a `render.yaml` file that automatically configures the deployment.

1. Log in to your Render dashboard
2. Click **New** and select **Blueprint**
3. Connect your GitHub repository
4. Render will detect the `render.yaml` file and configure everything automatically
5. Click **Apply** to start the deployment

### Option 2: Manual Configuration

If you prefer to configure manually:

1. Log in to your Render dashboard
2. Click **New** and select **Web Service**
3. Connect your GitHub repository
4. Configure with these settings:
   - **Name**: aivest (or your preferred name)
   - **Environment**: Python
   - **Region**: Choose closest to you
   - **Branch**: main (or your deployment branch)
   - **Build Command**: `pip install -r backend/requirements.txt && cd frontend && npm install && npm run build`
   - **Start Command**: `cd backend && gunicorn app:app`
   - **Health Check Path**: `/api/health`

5. Add environment variables:
   - `FLASK_ENV`: `production`
   - `PYTHON_VERSION`: `3.12.5`
   - `NODE_VERSION`: `18.0.0`

6. Click **Create Web Service**

## Post-Deployment Steps

1. Once deployed, get your Render URL (e.g., `https://aivest-xxxx.onrender.com`)

2. If necessary, update CORS settings in your backend code to include this URL

3. Test your deployment by visiting:
   - Main app: `https://aivest-xxxx.onrender.com`
   - Health check: `https://aivest-xxxx.onrender.com/api/health`

## Deployment Troubleshooting

If you encounter issues:

1. **CORS Errors**: Make sure your Render URL is added to the allowed origins in `app.py`

2. **Build Failures**: Check Render logs to see where the build process is failing

3. **Runtime Errors**: 
   - Check if gunicorn is properly installed
   - Verify your `app.py` is configured to serve static files correctly
   - Check environment variables are set properly

4. **Blank Page**: If frontend loads blank, check browser console for errors

## Migrating from Node.js to Flask

If you previously deployed with Node.js:

1. Delete the previous service in Render or create a new one
2. Follow the deployment steps above
3. Update any service that depends on your API to use the new URL

## Updating Your Deployment

To update your deployed application:

1. Push changes to your GitHub repository
2. Render will automatically rebuild and deploy

## Production Configuration

The frontend is configured to use relative API paths in production. This means:

- In development: API calls go to `http://localhost:5000/api/*`
- In production: API calls go to `/api/*` (same-origin)

This eliminates CORS issues in production while maintaining flexibility in development.

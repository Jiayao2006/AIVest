# Sample Data Mode

This application is currently configured to run in "Sample Data Only" mode, which means:

1. No API calls will be made to any backend server
2. All data is loaded from local sample data files
3. All operations (adding clients, filtering, etc.) work with the in-memory sample data

## Benefits

- No need to run a local backend server
- No connection errors when trying to reach a hosted backend
- The application can be deployed and demonstrated without any backend setup
- Eliminates network latency and related issues

## How it Works

The frontend code has been modified to:

1. Load data exclusively from the sample data files in `src/data/`
2. Simulate CRUD operations (create, read, update, delete) using state management
3. Keep all operations in memory without persistence beyond the current session

## Configuration

The sample data mode is enabled through the `.env` file with the setting:

```
VITE_SAMPLE_DATA_ONLY=true
```

## Switching to API Mode

To use a real backend again in the future:

1. Update the `.env` file to include:
   ```
   VITE_API_BASE_URL=http://localhost:5000
   # or your deployed backend URL
   ```

2. Remove `VITE_SAMPLE_DATA_ONLY=true`

3. Restore the API fetch code in the components:
   - ClientListPage.jsx
   - ClientDetailPage.jsx
   - Other components that make API calls

4. Run your Flask backend server locally or deploy it to a hosting provider

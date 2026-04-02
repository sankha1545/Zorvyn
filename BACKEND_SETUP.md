# FinTrack Backend Setup Guide

## Overview

FinTrack now includes a **real mock backend** with persistent data storage in a JSON file. Instead of using localStorage, all transaction data is stored in `server/db.json` and accessed via a REST API running on **http://localhost:5000**.

---

## Installation & Setup

### 1. Install Dependencies

First, install the new backend dependencies (Express, CORS, and Concurrently):

```bash
npm install
```

This will install:
- **express** - Backend web server framework
- **cors** - Cross-Origin Resource Sharing support
- **concurrently** - Run frontend and backend simultaneously

### 2. File Structure

The backend files are organized as follows:

```
webapp/
├── server.js                    # Main backend server file
├── server/
│   ├── db.json                 # Transaction database (auto-created)
│   └── seed.json               # Initial seed data

src/
├── services/
│   └── api.js                  # Updated to call real backend
└── ...rest of frontend
```

---

## Running the Application

### Option 1: Run Frontend and Backend Together (RECOMMENDED)

Run both the Vite dev server and Express backend simultaneously:

```bash
npm run dev:all
```

This command will:
- Start the Express backend on `http://localhost:5000`
- Start the Vite frontend dev server (usually `http://localhost:5173`)
- Both run concurrently in the same terminal

**Output example:**
```
> webapp@0.0.0 dev:all
> concurrently "npm run dev:backend" "npm run dev"

[0] 🚀 FinTrack Backend Server running on http://localhost:5000
[0] 📁 Database file: /path/to/webapp/server/db.json
[0] ✅ Ready for API requests
[1]   VITE v8.0.1  ready in 234 ms
[1]   ➜  Local:   http://localhost:5173/
```

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

---

## API Endpoints

The backend provides the following REST API endpoints:

### Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Fetch all transactions |
| POST | `/api/transactions` | Create a new transaction |
| PUT | `/api/transactions/:id` | Update a transaction |
| DELETE | `/api/transactions/:id` | Delete a transaction |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics` | Get analytics data (income, expenses, balance) |

### Utility

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/reset` | Reset database to seed data |

---

## Transaction Data Structure

Each transaction object has the following structure:

```json
{
  "id": 1,
  "date": "2026-03-01",
  "description": "Monthly Salary",
  "amount": 8500,
  "category": "Salary",
  "type": "Income",
  "merchant": "Acme Corp",
  "status": "Completed"
}
```

### Required Fields for Create/Update:
- `date` - Transaction date (YYYY-MM-DD)
- `description` - Transaction description
- `amount` - Transaction amount (number)
- `category` - Transaction category
- `type` - "Income" or "Expense"
- `merchant` - Merchant name
- `status` - "Completed" or "Pending"

---

## Database

### Location
The database is stored in a JSON file at: `server/db.json`

### Initial Data
The database is initialized with 50 realistic transactions from:
- **February 2026**: 19 transactions
- **March 2026**: 31 transactions

### Persistence
- All changes are automatically saved to `server/db.json`
- Data persists between server restarts
- The backend server reads and writes to the JSON file directly

### Reset
To reset the database to its initial state:
```bash
curl -X POST http://localhost:5000/api/reset
```

Or use the API:
```javascript
await resetDatabase();
```

---

## How It Works

### Flow Diagram

```
React Frontend
     ↓
API Service (src/services/api.js)
     ↓
Fetch HTTP Request
     ↓
Express Backend (server.js)
     ↓
Read/Write JSON File (server/db.json)
     ↓
Response with JSON data
     ↓
Zustand Store (src/store/useStore.js)
     ↓
React Components Update
     ↓
Dashboard & Transactions UI Updates
```

### Transaction Creation Example

1. User fills out form in Transactions page
2. Clicks "Add Transaction" button
3. Creates `{date, description, amount, category, type, merchant, status}`
4. Calls `createTransaction()` from API service
5. API makes `POST /api/transactions` request to backend
6. Backend generates new ID and saves to `server/db.json`
7. Backend returns created transaction with ID
8. Zustand store updates with new transaction
9. UI re-renders showing new transaction
10. New transaction is now persistent in the JSON file

---

## Troubleshooting

### Backend Not Starting

**Error**: `Cannot find module 'express'`
```bash
# Solution: Install dependencies
npm install
```

**Error**: `Port 5000 already in use`
```bash
# Solution: Find and kill process on port 5000
# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -i :5000
kill -9 <PID>
```

### API Errors

**Error**: `Cannot GET /api/transactions`
- Make sure backend is running on port 5000
- Check that the API service is calling `http://localhost:5000`

**Error**: `Failed to create transaction`
- Check that all required fields are provided
- Check the JSON format of the request

### Database Issues

**Reset database to initial state:**
```bash
curl -X POST http://localhost:5000/api/reset
```

**Check database file:**
```bash
cat server/db.json
```

**Manually edit database:**
Open `server/db.json` in your editor to make changes directly

---

## Development Tips

### Logging

The backend logs all requests to console:
```
🚀 FinTrack Backend Server running on http://localhost:5000
📁 Database file: /path/to/webapp/server/db.json
✅ Ready for API requests
```

### API Testing

Test API endpoints using fetch in browser console:

```javascript
// Get all transactions
fetch('http://localhost:5000/api/transactions').then(r => r.json()).then(console.log)

// Create a transaction
fetch('http://localhost:5000/api/transactions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    date: '2026-03-01',
    description: 'Test',
    amount: 100,
    category: 'Food & Dining',
    type: 'Expense',
    merchant: 'Test Merchant',
    status: 'Completed'
  })
}).then(r => r.json()).then(console.log)
```

### Live Editing

1. Edit `server/db.json` directly while server is running
2. Refresh frontend to fetch the latest data
3. Changes will be reflected immediately

---

## Build & Production

### Build for Production

```bash
npm run build
```

This creates optimized frontend files in the `dist/` folder.

**Note**: The backend is not included in the production build. For production:
- You would typically deploy the Express backend separately
- Or use a production-grade database like PostgreSQL, MongoDB, etc.
- Or use a serverless backend like AWS Lambda, Google Firebase

### Running Production Build

```bash
# Build frontend
npm run build

# Run backend
npm run dev:backend

# Serve frontend (in another terminal)
npx serve dist
```

---

## API Response Format

All API responses follow this standard format:

### Success Response
```json
{
  "success": true,
  "data": {
    "transactions": [...],
    "total": 50,
    "count": 10
  },
  "error": null,
  "timestamp": "2026-03-02T10:30:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "Transaction not found",
    "details": "..."
  },
  "timestamp": "2026-03-02T10:30:00.000Z"
}
```

---

## Next Steps

1. **Run the application**: `npm run dev:all`
2. **Create a transaction**: Go to Transactions page and click "Add Transaction"
3. **Edit a transaction**: Click the edit icon on any transaction
4. **Delete a transaction**: Click the delete icon and confirm
5. **Check persistence**: Refresh the browser - data is still there!
6. **Check database**: Open `server/db.json` to see the stored data

All changes are saved to the JSON file and persist across server restarts!

---

## Summary

✅ **Real backend** with Express server  
✅ **Persistent JSON database** in `server/db.json`  
✅ **Full CRUD operations** (Create, Read, Update, Delete)  
✅ **Dynamic data** from backend, not mock data  
✅ **Real API calls** from frontend to backend  
✅ **Initial seed data** with 50+ realistic transactions  

Your FinTrack app now has a **real backend** with persistent storage! 🎉

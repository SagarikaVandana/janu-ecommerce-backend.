# MongoDB Atlas Setup Guide

## 🚀 Quick Setup for Production

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (M0 Free tier is sufficient)

### Step 2: Configure Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Set username and password (save these!)
5. Set privileges to "Read and write to any database"
6. Click "Add User"

### Step 3: Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 4: Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string

### Step 5: Update Render Environment Variables
1. Go to your Render dashboard
2. Navigate to your backend service
3. Go to "Environment" tab
4. Add these variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/janu-collections
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
```

## 🔧 Connection String Format
```
mongodb+srv://username:password@cluster.mongodb.net/database-name
```

Replace:
- `username` with your MongoDB Atlas username
- `password` with your MongoDB Atlas password
- `cluster.mongodb.net` with your actual cluster URL
- `database-name` with your desired database name (e.g., `janu-collections`)

## ✅ Verification
After setting up, your server should show:
```
✅ Connected to MongoDB
📊 Database: janu-collections
🔗 Connection URL: mongodb+srv://***:***@cluster.mongodb.net/janu-collections
```

## 🆘 Troubleshooting
- **Connection refused**: Check Network Access settings
- **Authentication failed**: Verify username/password
- **Database not found**: The database will be created automatically 
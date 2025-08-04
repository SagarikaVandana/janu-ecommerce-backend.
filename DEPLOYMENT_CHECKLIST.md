# 🚀 Production Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. MongoDB Atlas Setup
- [ ] MongoDB Atlas account created
- [ ] Database user created with read/write permissions
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string copied

### 2. Environment Variables (Render)
Set these in your Render dashboard:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/janu-collections
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### 3. Test Locally
```bash
# Test MongoDB connection
npm run test:db

# Test server locally
npm run dev
```

### 4. Frontend Configuration
- [ ] Update API base URL in frontend
- [ ] Set CORS origins correctly
- [ ] Test API endpoints

## 🔧 Quick Fixes

### If MongoDB Connection Fails:
1. **Check MONGODB_URI format**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database-name
   ```

2. **Verify Atlas settings**:
   - Network Access: 0.0.0.0/0
   - Database User: Read/Write permissions
   - Cluster: Running and accessible

3. **Test connection**:
   ```bash
   npm run test:db
   ```

### If Server Won't Start:
1. **Check environment variables** on Render
2. **Verify package.json** has correct start script
3. **Check logs** for specific error messages

## 📊 Monitoring

### Health Check Endpoint
```
GET https://your-backend.onrender.com/api/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Logs to Watch For:
- ✅ `Connected to MongoDB`
- ✅ `All routes registered successfully`
- ✅ `Server running on port 5000`

## 🆘 Common Issues

### Issue: "MONGODB_URI environment variable is not set"
**Solution**: Set MONGODB_URI in Render environment variables

### Issue: "Authentication failed"
**Solution**: Check username/password in connection string

### Issue: "Connection refused"
**Solution**: Check Network Access settings in Atlas

### Issue: "ENOTFOUND"
**Solution**: Verify cluster URL in connection string

## 🎯 Success Indicators

When everything is working correctly, you should see:
```
✅ Connected to MongoDB
📊 Database: janu-collections
✅ All routes registered successfully
🚀 Server running on port 5000
🌍 Environment: production
``` 
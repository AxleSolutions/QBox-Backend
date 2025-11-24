# 🔧 Network Error Fix Guide

## ✅ Problem Solved!

The "Network Error" was caused by the **backend server not running** or **exiting immediately after startup**.

## 🚀 How to Start the Server (Choose One Method)

### Method 1: Double-click the Batch File (Easiest)
```
📁 QBox-Backend folder
   📄 START-SERVER.bat  ← Double-click this!
```

### Method 2: PowerShell Command
```powershell
cd D:\Projects\QBox\QBox-Backend
node server.js
```

### Method 3: New PowerShell Window
```powershell
cd D:\Projects\QBox\QBox-Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node server.js"
```

## 📱 API Configuration

### For Android Emulator:
```javascript
const API_URL = 'http://10.0.2.2:5000/api';
```
✅ **Already configured** in `src/services/api.js`

### For Real Android Device:
1. Open `src/services/api.js`
2. Comment out the emulator lines
3. Uncomment these lines:
```javascript
const API_URL = 'http://10.207.41.84:5000/api';
const SOCKET_URL = 'http://10.207.41.84:5000';
```

**Note:** Your computer's IP is **10.207.41.84**

## 🧪 How to Test if Server is Running

### Test 1: Health Check
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/health"
```
**Expected:** 
```
status : OK
message: QBox API is running
```

### Test 2: Login Test
```powershell
$body = @{email="john.smith@university.edu"; password="password123"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
```
**Expected:** Returns user data and token

## 🔥 Common Issues & Solutions

### Issue 1: "Network Error" in Mobile App
**Cause:** Backend server not running

**Solution:**
1. Open PowerShell in `QBox-Backend` folder
2. Run: `node server.js`
3. Keep the window open
4. Restart your mobile app

### Issue 2: Server Exits Immediately
**Cause:** PowerShell closes after running command

**Solution:** Use the START-SERVER.bat file or the Start-Process method

### Issue 3: Can't Connect from Real Device
**Causes:**
- Wrong IP address in API config
- Firewall blocking port 5000
- Device not on same network as computer

**Solutions:**
1. **Check IP:** Run `ipconfig` to verify your computer's IP
2. **Update API config:** Use your actual IP (currently 10.207.41.84)
3. **Firewall:** Run as Administrator:
   ```powershell
   netsh advfirewall firewall add rule name="Node.js Server Port 5000" dir=in action=allow protocol=TCP localport=5000
   ```
4. **Same Network:** Ensure phone and computer are on the same WiFi

### Issue 4: "Cannot find module" Error
**Cause:** Running node from wrong directory

**Solution:** Always navigate to QBox-Backend first:
```powershell
cd D:\Projects\QBox\QBox-Backend
node server.js
```

### Issue 5: "Address already in use"
**Cause:** Server already running on port 5000

**Solution:** Kill existing process:
```powershell
Stop-Process -Name node -Force
# Wait 2 seconds, then restart
node server.js
```

## 📊 Server Status Checklist

✅ **Server Running Correctly If You See:**
```
🚀 Server running on port 5000
✅ MongoDB Connected
```

✅ **Health Check Returns:**
```json
{
  "status": "OK",
  "message": "QBox API is running"
}
```

✅ **Mobile App Shows:** Real data from database, no network errors

❌ **Server NOT Running If:**
- PowerShell prompt returns immediately after "Server running"
- Health check fails
- Mobile app shows "Network Error"
- Test-NetConnection returns `TcpTestSucceeded: False`

## 🎯 Quick Start Workflow

### Every Time You Want to Test Your App:

1. **Start Backend Server**
   ```powershell
   cd D:\Projects\QBox\QBox-Backend
   node server.js
   ```
   → Keep this window open!

2. **Start Mobile App**
   ```powershell
   cd D:\Projects\QBox\QBox
   npx expo start
   ```

3. **Test Connection**
   - Android Emulator: Should work automatically
   - Real Device: Update IP in `api.js` if needed

## 🔍 Debugging Commands

### Check if port 5000 is listening:
```powershell
Test-NetConnection -ComputerName localhost -Port 5000
```

### Check server process:
```powershell
Get-Process -Name node -ErrorAction SilentlyContinue
```

### View server logs:
Look at the PowerShell window running `node server.js`

### Test API endpoints:
```powershell
# Health
Invoke-RestMethod http://localhost:5000/api/health

# Login
$body = @{email="john.smith@university.edu"; password="password123"} | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:5000/api/auth/login -Method Post -Body $body -ContentType "application/json"
```

## 💡 Pro Tips

1. **Keep Server Running:** Don't close the PowerShell window with the server
2. **Check Server First:** Always verify backend is running before testing mobile app
3. **Use Batch File:** Double-click `START-SERVER.bat` for easiest startup
4. **Real Device:** Make sure you're on the same WiFi as your computer
5. **Emulator:** Use 10.0.2.2 (already configured)

## 📞 Still Having Issues?

1. Verify server is running: `Invoke-RestMethod http://localhost:5000/api/health`
2. Check mobile app console logs for specific error messages
3. Ensure MongoDB Atlas connection string is correct in `.env`
4. Restart both backend server and mobile app
5. Try clearing React Native cache: `npx expo start --clear`

---

**Server is now running successfully! 🎉**

You can test by opening your mobile app and trying to login with:
- Email: `john.smith@university.edu`
- Password: `password123`

# GalaxiHire - Deployment Guide

## 🚀 Production Deployment Guide

This guide covers deploying GalaxiHire to production with separate services for Frontend (Vercel), Backend (Render), and Python Service (Render).

---

## **Pre-Deployment Checklist**

- [ ] All features tested locally
- [ ] Environment variables documented
- [ ] Database backup plan
- [ ] SSL certificates ready
- [ ] Domain names configured
- [ ] Git repository clean and tagged

---

## **Part 1: Python Service Deployment (Render)**

### **Step 1: Prepare Python Service**

Create `render.yaml` in `/python-service`:

```yaml
services:
  - type: web
    name: galaxihire-python
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: OPENAI_API_KEY
        sync: false
```

### **Step 2: Install Dependencies**

Ensure `requirements.txt` has:
```
fastapi
uvicorn
python-multipart
openai
PyPDF2
pdfplumber
python-docx
librosa
numpy
scipy
soundfile
```

### **Step 3: Deploy to Render**

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select `python-service` directory
5. Configure:
   - **Name**: `galaxihire-python`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
6. Add environment variable:
   - `OPENAI_API_KEY`: Your OpenAI API key
7. Click "Create Web Service"
8. Wait for deployment (5-10 minutes)
9. Copy the service URL (e.g., `https://galaxihire-python.onrender.com`)

### **Step 4: Test Python Service**

```bash
curl https://galaxihire-python.onrender.com/
# Should return: {"message": "Python service running successfully!"}
```

---

## **Part 2: Backend Deployment (Render)**

### **Step 1: Prepare Backend**

Create `render.yaml` in `/backend`:

```yaml
services:
  - type: web
    name: galaxihire-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGO_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: OPENAI_API_KEY
        sync: false
      - key: PYTHON_SERVICE_URL
        sync: false
      - key: PORT
        value: 4000
```

### **Step 2: Environment Variables**

Set these in Render dashboard:

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/galaxihire
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
OPENAI_API_KEY=sk-your-openai-key
PYTHON_SERVICE_URL=https://galaxihire-python.onrender.com
PORT=4000
```

### **Step 3: MongoDB Atlas Setup**

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Whitelist all IPs (0.0.0.0/0) for Render
5. Get connection string
6. Replace `<password>` with your password

### **Step 4: Deploy to Render**

1. Go to Render dashboard
2. Click "New +" → "Web Service"
3. Connect repository, select `backend` directory
4. Configure:
   - **Name**: `galaxihire-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add all environment variables
6. Create service
7. Copy URL (e.g., `https://galaxihire-backend.onrender.com`)

### **Step 5: Create Directories**

Add to `server.js` before `app.listen()`:

```javascript
const fs = require('fs');
const path = require('path');

// Create required directories
['reports', 'videos'].forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});
```

### **Step 6: Update CORS**

In `server.js`, update CORS for production:

```javascript
const cors = require('cors');

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-frontend-domain.vercel.app'
    : '*',
  credentials: true
};

app.use(cors(corsOptions));
```

### **Step 7: Test Backend**

```bash
curl https://galaxihire-backend.onrender.com/api/health
# Should return: {"status":"ok","timestamp":...}
```

---

## **Part 3: Frontend Deployment (Vercel)**

### **Step 1: Prepare Frontend**

Create `vercel.json` in `/frontend`:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

### **Step 2: Environment Variables**

Create `.env.production` in `/frontend`:

```env
NEXT_PUBLIC_API_URL=https://galaxihire-backend.onrender.com
```

### **Step 3: Deploy to Vercel**

**Option A: Vercel CLI**

```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

**Option B: Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Select `frontend` directory
5. Framework: Next.js (auto-detected)
6. Add environment variable:
   - `NEXT_PUBLIC_API_URL`: Your backend URL
7. Click "Deploy"
8. Wait for deployment (2-5 minutes)

### **Step 4: Custom Domain (Optional)**

1. In Vercel project settings
2. Go to "Domains"
3. Add your domain
4. Follow DNS configuration instructions

### **Step 5: Test Frontend**

Visit your Vercel URL:
- Try registration
- Login
- Start interview
- Verify API calls work

---

## **Part 4: Post-Deployment Configuration**

### **Update Backend CORS**

Now that you have frontend URL, update backend CORS:

```javascript
const corsOptions = {
  origin: [
    'https://your-app.vercel.app',
    'https://yourdomain.com' // if custom domain
  ],
  credentials: true
};
```

Redeploy backend.

### **Test Full Flow**

1. Register new account on production
2. Upload resume
3. Complete full interview
4. Generate report
5. Download PDF
6. Check all features work

---

## **Part 5: Monitoring & Maintenance**

### **Logging**

Backend already uses Winston logger. Logs appear in Render dashboard.

### **Error Monitoring (Optional)**

Sentry is already configured in backend. Add DSN:

```env
SENTRY_DSN=https://...@sentry.io/...
```

### **Uptime Monitoring**

Use services like:
- UptimeRobot (free)
- Pingdom
- StatusCake

Monitor:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://galaxihire-backend.onrender.com/api/health`
- Python: `https://galaxihire-python.onrender.com/`

### **Database Backups**

MongoDB Atlas auto-backups enabled by default. Configure:
1. Atlas dashboard → Cluster
2. "Backup" tab
3. Set schedule and retention

---

## **Environment Variables Summary**

### **Python Service**
```
OPENAI_API_KEY=sk-...
```

### **Backend**
```
NODE_ENV=production
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret
OPENAI_API_KEY=sk-...
PYTHON_SERVICE_URL=https://galaxihire-python.onrender.com
PORT=4000
```

### **Frontend**
```
NEXT_PUBLIC_API_URL=https://galaxihire-backend.onrender.com
```

---

## **Cost Estimate (Free Tier)**

- **Vercel**: Free (includes SSL, CDN)
- **Render**: Free tier available (services sleep after inactivity)
- **MongoDB Atlas**: Free M0 cluster (512MB)
- **OpenAI**: Pay per use

**Note**: Render free tier services sleep after 15 min inactivity. First request after sleep takes ~30s. Consider paid tier for production.

---

## **Deployment Checklist**

- [ ] Python service deployed to Render
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] MongoDB Atlas configured
- [ ] All environment variables set
- [ ] CORS configured correctly
- [ ] SSL certificates active (auto by Render/Vercel)
- [ ] Custom domain configured (optional)
- [ ] Test registration flow
- [ ] Test complete interview flow
- [ ] Test resume upload
- [ ] Test report generation
- [ ] Monitor logs for errors
- [ ] Set up uptime monitoring
- [ ] Document deployment date
- [ ] **Production ready!** ✅

---

## **Troubleshooting**

### **Backend can't connect to Python service**
- Check `PYTHON_SERVICE_URL` is correct
- Verify Python service is running
- Check Render logs for errors

### **Frontend API calls failing**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS configuration in backend
- Open browser console for errors

### **MongoDB connection issues**
- Verify connection string is correct
- Check IP whitelist includes `0.0.0.0/0`
- Confirm database user has correct permissions

### **OpenAI API errors**
- Verify API key is valid
- Check OpenAI account has credits
- Monitor rate limits

### **Render service sleeping**
- First request after sleep takes ~30s (normal on free tier)
- Consider upgrading to paid tier to avoid sleep

---

## **Rolling Back**

If deployment fails:

1. **Vercel**: Go to Deployments → Select previous → Promote to Production
2. **Render**: Dashboard → Service → Manual Deploy → Select previous commit
3. **MongoDB**: Restore from Atlas backup if needed

---

## **Next Steps After Deployment**

1. Monitor for 24-48 hours
2. Check error logs daily
3. Get user feedback
4. Plan feature updates
5. Set up CI/CD pipeline (optional)
6. Consider analytics (Google Analytics, Mixpanel)
7. Implement rate limiting for production
8. Add email notifications
9. Create admin dashboard

**Congratulations! Your AI Interview Platform is live! 🎉**

# Railway Deployment Steps for BITSA Website

## Prerequisites
✅ GitHub Repository: https://github.com/J4IMY/Bitsa-Hackathon
✅ Code pushed to main branch

## Step 1: Create Railway Project

1. Go to [railway.app](https://railway.app/)
2. Sign in with your **GitHub account**
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose repository: **`J4IMY/Bitsa-Hackathon`**
6. Select the **main** branch

## Step 2: Add PostgreSQL Database

1. In your Railway project dashboard, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically:
   - Create a PostgreSQL database
   - Inject `DATABASE_URL` environment variable into your service

## Step 3: Configure Environment Variables

Go to your service → **Variables** tab and add:

| Variable | Value |
|----------|-------|
| `SESSION_SECRET` | `15013524e97ddc68eeab1146a15f762da6b515140535d333bd30836c1f954081` |
| `NODE_ENV` | `production` |

*Note: `DATABASE_URL` is automatically set by Railway when you add PostgreSQL*

## Step 4: Verify Build Settings

Railway auto-detects settings from `package.json`. Verify:

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Port**: Railway will automatically detect port 5000

## Step 5: Deploy

1. Click **"Deploy"** (or Railway will auto-deploy on push)
2. Watch the build logs to ensure everything compiles correctly
3. Wait for deployment to complete

## Step 6: Push Database Schema

After deployment, you need to initialize the database:

### Option A: Using Railway CLI (Recommended)

1. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Link to your project:
   ```bash
   railway link
   ```

4. Run database migration:
   ```bash
   railway run npm run db:push
   ```

### Option B: Manual via Railway Dashboard

1. Go to your service → **Settings** → **Variables**
2. Copy the `DATABASE_URL` value
3. Run locally:
   ```bash
   DATABASE_URL="<your-railway-database-url>" npm run db:push
   ```

## Step 7: Verify Deployment

1. Railway will provide a URL (e.g., `https://your-app.railway.app`)
2. Open the URL in your browser
3. Test the following:
   - ✅ Homepage loads
   - ✅ User authentication works
   - ✅ Discussion rooms function
   - ✅ Event registration works

## Troubleshooting

### Build Fails
- Check the build logs in Railway dashboard
- Verify all dependencies are in `package.json`
- Ensure TypeScript compiles without errors

### Database Connection Issues
- Verify `DATABASE_URL` is set correctly
- Ensure database schema is pushed (`npm run db:push`)
- Check database logs in Railway

### App Crashes on Start
- Check deployment logs
- Verify `NODE_ENV=production` is set
- Ensure port configuration is correct

## Auto-Deployments

Railway automatically redeploys when you push to the main branch:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

## Monitoring

- **Logs**: View real-time logs in Railway dashboard
- **Metrics**: Monitor CPU, memory, and network usage
- **Alerts**: Set up webhooks for deployment notifications

## Cost Optimization

- Railway provides $5 free credit per month
- Monitor usage in the billing section
- Consider using Railway's sleep mode for non-production apps

---

## Summary

✅ Repository: Connected
✅ Database: PostgreSQL added
✅ Environment: Configured
✅ Build: Auto-detected
✅ Ready to deploy!

**Your generated SESSION_SECRET**: `15013524e97ddc68eeab1146a15f762da6b515140535d333bd30836c1f954081`

For more details, see the official Railway docs: https://docs.railway.app/

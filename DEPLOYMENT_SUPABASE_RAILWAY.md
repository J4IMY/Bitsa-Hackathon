# Deployment Guide: Railway + Supabase

This guide details how to deploy the BITSA application to **Railway** while using **Supabase** as the PostgreSQL database provider.

## Prerequisites

*   **GitHub Account**: Your code must be pushed to a GitHub repository.
*   **Railway Account**: Sign up at [railway.app](https://railway.app/).
*   **Supabase Account**: Sign up at [supabase.com](https://supabase.com/).

---

## Step 1: Set Up Supabase Database

1.  **Create a New Project**:
    *   Go to your Supabase Dashboard and click **"New Project"**.
    *   Select your organization, name the project (e.g., `bitsa-db`), and set a strong database password. **Save this password!**
    *   Choose a region close to your expected users (and preferably close to your Railway region, usually US West or US East).

2.  **Get the Connection String**:
    *   Once the project is created, go to **Project Settings** (cog icon) -> **Database**.
    *   Under **Connection parameters**, look for the **Connection String** section.
    *   Click on the **URI** tab.
    *   **Important**: For production apps on serverless platforms, it is often recommended to use the **Transaction Pooler** (port 6543) if available, but the direct connection (port 5432) works fine for standard Node.js apps on Railway.
    *   Copy the connection string. It will look like this:
        `postgresql://postgres:[YOUR-PASSWORD]@db.xyz.supabase.co:5432/postgres`
    *   Replace `[YOUR-PASSWORD]` with the password you created in step 1.

---

## Step 2: Set Up Railway Project

1.  **New Project**:
    *   Go to your Railway Dashboard.
    *   Click **"+ New Project"** -> **"Deploy from GitHub repo"**.
    *   Select your `Bitsa-Hackathon` repository.
    *   Click **"Deploy Now"**.

2.  **Wait (and Expect Failure)**:
    *   The initial deployment might fail or hang because the database connection is missing. This is normal.

---

## Step 3: Configure Environment Variables

This is the most critical step. You need to provide the application with the keys to talk to Supabase and secure user sessions.

Go to your Railway project -> Select your Service (the card with your repo name) -> **Variables**.

Add the following variables. They are categorized for clarity:

### 1. Database Configuration
| Variable | Value | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://...` | The connection string you copied from Supabase. **Ensure you replaced the password.** |

### 2. Application Security
| Variable | Value | Description |
| :--- | :--- | :--- |
| `SESSION_SECRET` | *[See Below]* | A long, random string used to encrypt session cookies. |

*   **To generate a `SESSION_SECRET`**: You can use a password generator or run this command in your terminal: `openssl rand -hex 32`
*   *Example Value*: `a1b2c3d4e5f6...` (Make it at least 32 characters long)

### 3. Runtime Configuration
| Variable | Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Tells the app to run in production mode (optimizes performance). |
| `PORT` | `5000` | (Optional) Railway usually sets this automatically, but setting it ensures consistency. |

---

## Step 4: Push Database Schema

Your Supabase database is currently empty. You need to push your table structure (schema) to it.

**Option A: From Your Local Machine (Easiest)**

1.  In your local VS Code terminal, ensure you have the `DATABASE_URL` for Supabase ready.
2.  Run the migration command using the Supabase URL explicitly:

    ```bash
    # Windows PowerShell
    $env:DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xyz.supabase.co:5432/postgres"; npm run db:push
    ```

    *Replace the URL with your actual Supabase connection string.*

**Option B: Using Railway CLI**

If you have the Railway CLI installed and linked:
```bash
railway run npm run db:push
```

---

## Step 5: Redeploy

1.  Once the variables are saved and the schema is pushed, Railway usually triggers a redeploy automatically.
2.  If not, go to the **Deployments** tab in Railway and click **"Redeploy"** on the latest commit.
3.  Watch the logs. You should see "Server started on port 5000" (or similar).

## Step 6: Verify

Open the URL provided by Railway (e.g., `https://bitsa-hackathon-production.up.railway.app`).
*   Try to **Register** a new user (this confirms the database write connection).
*   Try to **Login** (confirms read connection and session secret).

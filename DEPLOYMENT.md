# Deployment Guide for BITSA Website

This project is a **monolithic application** where the Node.js/Express backend also serves the React frontend. This makes deployment straightforward as you only need to deploy one service.

## Option 1: Deploying on Replit (Recommended)

Since this project is already set up in Replit, this is the easiest method.

1.  **Database**: Ensure your PostgreSQL database is set up. Replit usually handles this automatically with the "PostgreSQL" extension.
2.  **Secrets**: Go to the **Secrets** (Lock icon) tab in the sidebar and ensure the following are set:
    *   `DATABASE_URL`: Your PostgreSQL connection string.
    *   `SESSION_SECRET`: A long random string for securing sessions.
3.  **Run**: Simply click the **Run** button. Replit detects the `npm run dev` command.
4.  **Production Mode**: To run in production mode on Replit:
    *   Update the `.replit` file `run` command to: `npm run build && npm start`
    *   Or manually run `npm run build` in the shell, then `npm start`.

## Option 2: Deploying on Render / Railway / Heroku

These platforms are excellent for Node.js applications with databases.

### Prerequisites
*   A GitHub repository containing this code.
*   A PostgreSQL database (often provided by the hosting platform).

### Steps for Render.com

1.  **Create a Web Service**: Connect your GitHub repository.
2.  **Build Command**: `npm install && npm run build`
3.  **Start Command**: `npm start`
4.  **Environment Variables**: Add the following in the "Environment" tab:
    *   `DATABASE_URL`: The connection string to your PostgreSQL database (Render provides a managed Postgres you can create and link).
    *   `SESSION_SECRET`: A random string (e.g., generated via `openssl rand -hex 32`).
    *   `NODE_ENV`: `production`
5.  **Deploy**: Click "Create Web Service". Render will build the frontend, compile the backend, and start the server.

### Steps for Railway.app

1.  **New Project**: Select "Deploy from GitHub repo".
2.  **Add Database**: Add a PostgreSQL database to your project.
3.  **Variables**: Railway automatically injects `DATABASE_URL` if you add a Postgres plugin. You just need to add `SESSION_SECRET`.
4.  **Build & Start**: Railway automatically detects `package.json` scripts. It will use `npm run build` and `npm start` by default.

## Database Migrations

When deploying for the first time, you need to push your database schema.

*   **Replit**: The app usually handles this, or you can run `npm run db:push` in the shell.
*   **Render/Railway**: You can add a "Build Command" that includes the migration, or run it manually via the platform's shell/console:
    ```bash
    npm run db:push
    ```
    *Note: Ensure `drizzle-kit` is available or installed.*

## Environment Variables Reference

| Variable | Description | Required |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SESSION_SECRET` | Secret key for signing session cookies | Yes |
| `PORT` | Port to listen on (default: 5000) | No (Platform usually sets this) |
| `NODE_ENV` | `development` or `production` | No (Default: development) |

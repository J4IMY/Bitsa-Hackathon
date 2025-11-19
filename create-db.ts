import pg from 'pg';
import 'dotenv/config';

const { Client } = pg;

// Parse the DATABASE_URL to get credentials, but connect to 'postgres' database
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error("DATABASE_URL not set");

const url = new URL(dbUrl);
url.pathname = '/postgres'; // Connect to default postgres db
const connectionString = url.toString();

const client = new Client({
    connectionString,
});

async function createDb() {
    try {
        await client.connect();
        const dbName = process.env.DB_NAME || 'bitsa_db_new';

        // Check if database exists
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);

        if (res.rowCount === 0) {
            // Create database if it doesn't exist
            // Cannot use parameterized query for database name in CREATE DATABASE
            await client.query(`CREATE DATABASE "${dbName}"`);
            console.log(`Database ${dbName} created successfully`);
        } else {
            console.log(`Database ${dbName} already exists`);
        }
    } catch (err) {
        console.error('Error creating database:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

createDb();

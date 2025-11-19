import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function migrateSchema() {
    const client = await pool.connect();
    try {
        console.log('Starting schema migration...');

        // Add password column if it doesn't exist
        await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS password TEXT;
    `);
        console.log('✓ Added password column');

        // Add reset token columns if they don't exist
        await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS reset_token TEXT,
      ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMP;
    `);
        console.log('✓ Added reset token columns');

        console.log('✓ Schema migration completed successfully!');
    } catch (error) {
        console.error('Error during migration:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

migrateSchema();

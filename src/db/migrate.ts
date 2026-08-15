import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './pool';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  await pool.query(sql);
  console.log('migration complete');
  await pool.end();
}

migrate().catch(async (err) => {
  console.error('migration failed', err);
  await pool.end();
  process.exit(1);
});
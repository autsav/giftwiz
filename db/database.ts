import * as SQLite from 'expo-sqlite';

export async function initDatabase() {
  const db = await SQLite.openDatabaseAsync('giftwiz.db');

  // Enable foreign keys
  await db.execAsync('PRAGMA foreign_keys = ON;');

  // Create tables
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT,
      provider TEXT DEFAULT 'guest',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS recipient_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      name TEXT,
      relation TEXT,
      age TEXT,
      occasion TEXT,
      budget_min REAL,
      budget_max REAL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS swipe_sessions (
      id TEXT PRIMARY KEY,
      profile_id TEXT,
      preferences TEXT, -- JSON string
      rejected_tags TEXT, -- JSON string
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (profile_id) REFERENCES recipient_profiles(id)
    );

    CREATE TABLE IF NOT EXISTS recommendations (
      id TEXT PRIMARY KEY,
      profile_id TEXT,
      product_title TEXT,
      product_image_url TEXT,
      price TEXT,
      purchase_link TEXT,
      is_saved INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (profile_id) REFERENCES recipient_profiles(id)
    );

    -- Ensure guest_user exists
    INSERT OR IGNORE INTO users (id, email, provider) VALUES ('guest_user', 'guest@giftwiz.ai', 'guest');
    
    -- Ensure a default fallback profile exists for development testing
    INSERT OR IGNORE INTO recipient_profiles (id, user_id, name, relation, age, occasion, budget_min, budget_max) 
    VALUES ('default_tester_profile', 'guest_user', 'Tester', 'Friend', '25', 'Birthday', 0, 100);
  `);

  return db;
}

export const getDB = async () => {
  return await SQLite.openDatabaseAsync('giftwiz.db');
};

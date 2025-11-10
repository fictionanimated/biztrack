
import { hash } from 'bcryptjs';
import { createUser } from '../lib/services/userService';
import clientPromise from '../lib/mongodb';
import 'dotenv/config';

async function main() {
  const username = process.env.INITIAL_ADMIN_USERNAME;
  const password = process.env.INITIAL_ADMIN_PASSWORD;

  if (!username || !password) {
      console.error("ERROR: Please set INITIAL_ADMIN_USERNAME and INITIAL_ADMIN_PASSWORD in your .env file.");
      process.exit(1);
  }

  console.log(`Attempting to create user: ${username}...`);

  try {
    const passwordHash = await hash(password, 10);
    const user = await createUser(username, passwordHash);
    console.log("✅ User created successfully!");
    console.log(`   ID: ${user._id}`);
    console.log(`   Username: ${user.username}`);
  } catch (error: any) {
    if (error.message.includes("already exists")) {
        console.warn(`⚠️  Warning: ${error.message}`);
    } else {
        console.error("❌ An unexpected error occurred:", error);
    }
  } finally {
    const client = await clientPromise;
    await client.close();
  }
}

main().catch(console.error);

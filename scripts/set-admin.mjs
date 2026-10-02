import { MongoClient } from "mongodb";

const email = process.argv[2];
if (!email) {
  console.error("Usage: node scripts/set-admin.mjs <email>");
  process.exit(1);
}

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://5gvx8w9_db_user:tcvSQmCaBSqRLD5i@nexhack.b3vtgqi.mongodb.net/?retryWrites=true&w=majority";
const dbName = process.env.MONGODB_DB || "nexhack";

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const cleanEmail = email.toLowerCase().trim();
  const now = new Date().toISOString();

  await db.collection("user_profiles").updateOne(
    { email: cleanEmail },
    {
      $set: {
        email: cleanEmail,
        role: "admin",
        updatedAt: now,
      },
      $setOnInsert: {
        userId: `usr_${Date.now()}`,
        displayName: cleanEmail.split("@")[0],
        createdAt: now,
      },
    },
    { upsert: true }
  );

  console.log(`✅ Granted "admin" role in MongoDB Atlas for: ${cleanEmail}`);
  await client.close();
}

run().catch((err) => {
  console.error("❌ Error setting admin in MongoDB:", err);
  process.exit(1);
});

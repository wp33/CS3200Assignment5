const { MongoClient } = require("mongodb");

async function main() {
  const client = new MongoClient("mongodb://localhost:27017");
  try {
    await client.connect();
    const db = client.db("ieeevisTweets");
    const tweetsCol = db.collection("tweets");
    const collections = await db.listCollections().toArray();
    const collNames = collections.map((c) => c.name);
    if (collNames.includes("user")) await db.collection("user").drop();
    if (collNames.includes("Tweets_Only")) await db.collection("Tweets_Only").drop();

    console.log("Step 1: Extracting unique users...");
    await tweetsCol.aggregate([
      { $group: { _id: "$user.id", user: { $first: "$user" } } },
      { $replaceRoot: { newRoot: "$user" } },
      { $out: "user" },
    ]).toArray();
    const userCount = await db.collection("user").countDocuments();
    console.log(`  Created 'user' collection with ${userCount} unique users.`);

    console.log("Step 2: Creating Tweets_Only collection...");
    await tweetsCol.aggregate([
      { $addFields: { user_id: "$user.id" } },
      { $project: { user: 0 } },
      { $out: "Tweets_Only" },
    ]).toArray();
    const tweetCount = await db.collection("Tweets_Only").countDocuments();
    console.log(`  Created 'Tweets_Only' collection with ${tweetCount} tweets.`);

    const sample = await db.collection("Tweets_Only").findOne({});
    console.log("\nSample Tweets_Only document:");
    console.log(JSON.stringify(sample, null, 2));
  } finally {
    await client.close();
  }
}
main().catch(console.error);

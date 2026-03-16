const { MongoClient } = require("mongodb");

async function main() {
  const client = new MongoClient("mongodb://localhost:27017");
  try {
    await client.connect();
    const db = client.db("ieeevisTweets");
    const tweetsCol = db.collection("tweets");
    const collections = await db.listCollections().toArray();
    const collNames = collections.map((c) => c.name);
    if (collNames.includes("users")) await db.collection("users").drop();
    if (collNames.includes("tweets_only")) await db.collection("tweets_only").drop();

    console.log("Step 1: Extracting unique users...");
    await tweetsCol.aggregate([
      { $group: { _id: "$user.id", user: { $first: "$user" } } },
      { $replaceRoot: { newRoot: "$user" } },
      { $out: "users" },
    ]).toArray();
    const userCount = await db.collection("users").countDocuments();
    console.log(`  Created 'users' collection with ${userCount} unique users.`);

    console.log("Step 2: Creating tweets_only collection...");
    await tweetsCol.aggregate([
      { $addFields: { user_id: "$user.id" } },
      { $project: { user: 0 } },
      { $out: "tweets_only" },
    ]).toArray();
    const tweetCount = await db.collection("tweets_only").countDocuments();
    console.log(`  Created 'tweets_only' collection with ${tweetCount} tweets.`);

    const sample = await db.collection("tweets_only").findOne({});
    console.log("\nSample tweet_only document:");
    console.log(JSON.stringify(sample, null, 2));
  } finally {
    await client.close();
  }
}
main().catch(console.error);

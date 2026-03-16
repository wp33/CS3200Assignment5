const { MongoClient } = require("mongodb");

async function main() {
  const client = new MongoClient("mongodb://localhost:27017");
  try {
    await client.connect();
    const db = client.db("ieeevisTweets");
    const collection = db.collection("tweets");
    const results = await collection.aggregate([
      { $group: { _id: "$user.screen_name", tweet_count: { $sum: 1 } } },
      { $sort: { tweet_count: -1 } },
      { $limit: 1 },
      { $project: { _id: 0, screen_name: "$_id", tweet_count: 1 } },
    ]).toArray();
    console.log("Person with the most tweets:");
    console.table(results);
  } finally {
    await client.close();
  }
}
main().catch(console.error);

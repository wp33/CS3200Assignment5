const { MongoClient } = require("mongodb");

async function main() {
  const client = new MongoClient("mongodb://localhost:27017");
  try {
    await client.connect();
    const db = client.db("ieeevisTweets");
    const collection = db.collection("tweets");
    const results = await collection.aggregate([
      { $group: { _id: "$user.screen_name", followers: { $max: "$user.followers_count" } } },
      { $sort: { followers: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, screen_name: "$_id", followers_count: "$followers" } },
    ]).toArray();
    console.log("Top 10 screen_names by followers:");
    console.table(results);
  } finally {
    await client.close();
  }
}
main().catch(console.error);

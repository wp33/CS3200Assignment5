const { MongoClient } = require("mongodb");

async function main() {
  const client = new MongoClient("mongodb://localhost:27017");
  try {
    await client.connect();
    const db = client.db("ieeevisTweets");
    const collection = db.collection("tweets");
    const results = await collection.aggregate([
      { $group: { _id: "$user.screen_name", avg_retweets: { $avg: "$retweet_count" }, tweet_count: { $sum: 1 } } },
      { $match: { tweet_count: { $gt: 3 } } },
      { $sort: { avg_retweets: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, screen_name: "$_id", avg_retweets: { $round: ["$avg_retweets", 2] }, tweet_count: 1 } },
    ]).toArray();
    console.log("Top 10 people by average retweets (with more than 3 tweets):");
    console.table(results);
  } finally {
    await client.close();
  }
}
main().catch(console.error);

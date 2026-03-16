# IEEE VIS 2020 Tweets — MongoDB Queries

Node.js scripts that query and transform a MongoDB collection of tweets from the IEEE VIS 2020 conference.

## Prerequisites

- **Node.js** (v16+)
- **MongoDB** running on `localhost:27017`

## Loading the Data

1. Download the tweet dump:
   ```
   https://johnguerra.co/viz/influentials/ieeevis2020/ieeevis2020Tweets.dump.bz2
   ```
2. Extract the `.bz2` file using `bunzip2`, 7-Zip, or Keka to get `ieeevis2020Tweets.dump`.
   ```bash
   bunzip2 ieeevis2020Tweets.dump.bz2
   ```
3. Import into MongoDB:
   ```bash
   mongoimport -h localhost:27017 -d ieeevisTweets -c tweets --file ieeevis2020Tweets.dump
   ```
   This imports 3,325 documents into the `tweets` collection.

## Install Dependencies

```bash
npm install
```

## Running the Queries

```bash
node Query1.js   # Count of tweets that are not retweets or replies
node Query2.js   # Top 10 screen_names by follower count
node Query3.js   # Person with the most tweets
node Query4.js   # Top 10 by avg retweets (min 3 tweets)
node Query5.js   # Separate Users and Tweets_Only collections
```

## Query Descriptions and Results

### Query1: Tweets that are not retweets or replies
Filters out documents where `retweeted_status` exists or `in_reply_to_status_id` is not null.
**Result:** 1,117 tweets

### Query2: Top 10 screen_names by follower count
Groups by `user.screen_name`, takes the max `followers_count` per user, sorts descending, limits to 10.
**Top result:** MSFTResearch with 513,811 followers

### Query3: Person with the most tweets
Groups by `user.screen_name`, counts tweets per user, returns the top 1.
**Result:** tmrhyne with 156 tweets

### Query4: Top 10 by average retweets (more than 3 tweets)
Computes the average `retweet_count` per user, filters to users with more than 3 tweets, sorts by average descending, limits to 10.
**Top result:** DamonCrockett with 16.8 average retweets

### Query5: Separate Users and Tweets_Only collections
Normalizes the database into two new collections:
- `users` — 1,135 unique users extracted via `$group` on `user.id`
- `tweets_only` — 3,325 tweets where the embedded `user` object is replaced with a `user_id` reference field

---

## AI Disclosure

This assignment was completed with the assistance of **Claude Opus 4 (by Anthropic)**, accessed through the claude.ai chat interface.

### How AI was used

Claude was used to generate the initial Node.js query scripts (Query1–5.js), the package.json, and the README. I also used Claude to troubleshoot setup issues during the process, including installing Homebrew, MongoDB, extracting the data file, and pushing to GitHub.

### Example prompts used

- *"In this assignment you will be using Node to query and modify a Mongo Document Database..."* — I provided the full assignment description and Claude generated all five query scripts, the package.json, and a README.
- *"would I select bzip2"* — Asked for help extracting the `.bz2` data file.
- *"zsh: command not found: brew"* — Troubleshooted Homebrew installation on macOS.
- *"bunzip2: Can't open input file ieeevis2020Tweets.dump.bz2: No such file or directory"* — Needed help navigating to the correct directory before running the extraction command.
- *"node_modules folder is in the repo"* — Asked how to remove `node_modules` from the GitHub repository.
- *"can you give me an overview of the contents"* — Asked Claude to summarize what each file does and the query results.

### What Claude helped with

- Writing all five MongoDB aggregation query scripts in Node.js
- Creating the project structure (package.json, .gitignore, README)
- Step-by-step guidance for installing Homebrew, MongoDB, and Node dependencies on macOS
- Extracting the `.bz2` data file and importing it with `mongoimport`
- Troubleshooting Git issues when pushing to GitHub
- Explaining the query logic and results

### Model

Claude Opus 4 by Anthropic (claude.ai)

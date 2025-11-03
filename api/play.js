import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {
  if (req.method === "POST") {
    await redis.set("play_flag", "1");
    return res.status(200).json({ ok: true });
  }

  if (req.method === "GET") {
    const playFlag = await redis.get("play_flag");
    if (playFlag === "1") {
      await redis.set("play_flag", "0"); // reset after reading
      return res.status(200).json({ play: true });
    } else {
      return res.status(200).json({ play: false });
    }
  }

  res.status(405).end();
}

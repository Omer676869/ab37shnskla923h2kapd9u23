import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { id } = req.body;
    if (id) {
      await redis.sadd("ready_users", id);
      return res.status(200).json({ ok: true });
    }
  }

  if (req.method === "GET") {
    const ready = await redis.smembers("ready_users");
    return res.status(200).json({ ready });
  }

  res.status(405).end();
}

let readyUsers = new Set();

export default function handler(req, res) {
  if (req.method === "POST") {
    const { id } = req.body;
    if (id) readyUsers.add(id);
    return res.status(200).json({ ok: true });
  }
  if (req.method === "GET") {
    return res.status(200).json({ ready: Array.from(readyUsers) });
  }
  res.status(405).end();
}

export { readyUsers };

import { readyUsers } from "./ready.js";

let shouldPlay = false;

export default function handler(req, res) {
  if (req.method === "POST") {
    shouldPlay = true;
    return res.status(200).json({ ok: true });
  }

  if (req.method === "GET") {
    const play = shouldPlay;
    shouldPlay = false; // reset
    return res.status(200).json({ play, readyUsers: Array.from(readyUsers) });
  }

  res.status(405).end();
}

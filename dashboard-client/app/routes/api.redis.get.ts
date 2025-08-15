import type { ActionFunction } from "@remix-run/node";
import { createClient } from "redis";

const redis = createClient({
  url: "redis://localhost:6379",
});
redis.connect();

export const action: ActionFunction = async ({ request }) => {
  try {
    const { key } = await request.json();
    if (!key) {
      return new Response(JSON.stringify({ error: "Key is required" }), {
        status: 400,
      });
    }

    const value = await redis.get(key);

    return new Response(JSON.stringify({ key, value }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};

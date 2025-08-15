import type { ActionFunction } from "@remix-run/node";
import { createClient } from "redis";

const redis = createClient({ url: "redis://localhost:6379" });
redis.connect();

export const action: ActionFunction = async ({ request }) => {
  try {
    const { key, value } = await request.json();
    if (!key) {
      return new Response(JSON.stringify({ error: "Key is required" }), {
        status: 400,
      });
    }

    await redis.set(key, JSON.stringify(value));

    return new Response(JSON.stringify({ key, status: "updated" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};

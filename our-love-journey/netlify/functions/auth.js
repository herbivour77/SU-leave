import { getStore } from "@netlify/blobs";

// Same default as the app's client-side fallback, so a fresh deploy and an
// offline client agree on Basil's password until the store has real data.
const DEFAULT_AUTH = {
  basil: { name: "Basil", hash: "6442394142ad93092628f27e7bd1ee532794a3e129b46e55d6b8b3a173400a20" },
  leren: { name: "Ler En", hash: null },
};

export default async (req) => {
  const store = getStore("our-love-journey");

  if (req.method === "GET") {
    let auth = await store.get("auth", { type: "json" });
    if (!auth) {
      auth = DEFAULT_AUTH;
      await store.setJSON("auth", auth);
    }
    return new Response(JSON.stringify(auth), {
      headers: { "content-type": "application/json" },
    });
  }

  if (req.method === "POST") {
    const body = await req.json().catch(() => null);
    if (!body || !body.basil || !body.leren) {
      return new Response(JSON.stringify({ error: "Invalid auth payload" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }
    await store.setJSON("auth", body);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "content-type": "application/json" },
    });
  }

  return new Response("Method Not Allowed", { status: 405 });
};

export const config = { path: "/api/auth" };

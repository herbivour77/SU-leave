import { getStore } from "@netlify/blobs";

// Same starter events as the app's client-side fallback, used only the very
// first time the store is empty.
const SEED_EVENTS = [
  { id:"e1", title:"Our Love Journey app is born \ud83d\udc8c", category:"wetime", start:"2026-08-04", end:"2026-08-04", time:"", location:"" },
  { id:"e2", title:"Date night", category:"wetime", start:"2026-08-08", end:"2026-08-08", time:"7pm", location:"" },
  { id:"e3", title:"Morning jog together", category:"exercise", start:"2026-08-10", end:"2026-08-10", time:"7am", location:"" },
  { id:"e4", title:"Grocery run", category:"daily", start:"2026-08-12", end:"2026-08-12", time:"", location:"" },
  { id:"e5", title:"Project deadline", category:"work", start:"2026-08-14", end:"2026-08-14", time:"", location:"" },
];

export default async (req) => {
  const store = getStore("our-love-journey");

  if (req.method === "GET") {
    let events = await store.get("events", { type: "json" });
    if (!events) {
      events = SEED_EVENTS;
      await store.setJSON("events", events);
    }
    return new Response(JSON.stringify(events), {
      headers: { "content-type": "application/json" },
    });
  }

  if (req.method === "POST") {
    const body = await req.json().catch(() => null);
    if (!Array.isArray(body)) {
      return new Response(JSON.stringify({ error: "Expected an array of events" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }
    await store.setJSON("events", body);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "content-type": "application/json" },
    });
  }

  return new Response("Method Not Allowed", { status: 405 });
};

export const config = { path: "/api/events" };

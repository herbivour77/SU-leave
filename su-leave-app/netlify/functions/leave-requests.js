// Shared, cross-device storage for leave applications & cancellations.
// Uses Netlify Blobs, which is built into any site hosted on Netlify —
// no external account or API key needed. Every visitor's browser talks
// to this one function, which reads/writes the same store, so everyone
// sees the same data regardless of device.

const { getStore } = require("@netlify/blobs");

const HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: HEADERS, body: "" };
  }

  const store = getStore("leave-requests");

  try {
    if (event.httpMethod === "GET") {
      const data = await store.get("requests", { type: "json" });
      return { statusCode: 200, headers: HEADERS, body: JSON.stringify(data || []) };
    }

    if (event.httpMethod === "POST") {
      const list = JSON.parse(event.body || "[]");
      await store.setJSON("requests", list);
      return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 405, headers: HEADERS, body: JSON.stringify({ error: "Method not allowed" }) };
  } catch (err) {
    return { statusCode: 500, headers: HEADERS, body: JSON.stringify({ error: err.message }) };
  }
};

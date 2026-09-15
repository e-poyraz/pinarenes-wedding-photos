import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const store = getStore("wedding-photos");
    const { blobs } = await store.list();

    const items = await Promise.all(
      blobs.map(async ({ key }) => {
        const meta = await store.getMetadata(key);
        return {
          key,
          url: `/api/photo/${encodeURIComponent(key)}`,
          uploader: meta?.metadata?.uploader || "Misafir",
          uploadedAt: meta?.metadata?.uploadedAt || null,
        };
      })
    );

    items.sort((a, b) => (b.uploadedAt || "").localeCompare(a.uploadedAt || ""));

    return new Response(JSON.stringify({ items }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("List error:", err);
    return new Response(JSON.stringify({ error: "Fotoğraflar yüklenemedi." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config = {
  path: "/api/list-photos",
};

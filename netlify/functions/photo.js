import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const key = context.params.key;
  if (!key) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const store = getStore("wedding-photos");
    const result = await store.getWithMetadata(key, { type: "arrayBuffer" });

    if (!result) {
      return new Response("Not found", { status: 404 });
    }

    const contentType = result.metadata?.contentType || "application/octet-stream";

    return new Response(result.data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("Photo fetch error:", err);
    return new Response("Not found", { status: 404 });
  }
};

export const config = {
  path: "/api/photo/:key",
};

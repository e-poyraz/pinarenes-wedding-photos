import { getStore } from "@netlify/blobs";

const MAX_BYTES = 9 * 1024 * 1024; // 9MB safety margin (Netlify sync function body limit is ~10MB)
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const form = await req.formData();
    const file = form.get("photo");
    const uploader = (form.get("uploader") || "").toString().trim().slice(0, 60);

    if (!file || typeof file === "string") {
      return json({ error: "Fotoğraf bulunamadı." }, 400);
    }

    if (file.size > MAX_BYTES) {
      return json({ error: "Dosya çok büyük. Lütfen 9MB altında bir fotoğraf yükleyin." }, 413);
    }

    const contentType = file.type || "application/octet-stream";
    if (!ALLOWED_TYPES.has(contentType)) {
      return json({ error: "Sadece fotoğraf dosyaları (jpg, png, webp, heic) kabul edilir." }, 415);
    }

    const buffer = await file.arrayBuffer();

    const store = getStore("wedding-photos");
    const timestamp = Date.now();
    const rand = Math.random().toString(36).slice(2, 8);
    const ext = contentType.split("/")[1] || "jpg";
    const key = `${timestamp}-${rand}.${ext}`;

    await store.set(key, buffer, {
      metadata: {
        contentType,
        uploader: uploader || "Misafir",
        uploadedAt: new Date(timestamp).toISOString(),
      },
    });

    return json({ ok: true, key });
  } catch (err) {
    console.error("Upload error:", err);
    return json({ error: "Yükleme sırasında bir hata oluştu." }, 500);
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const config = {
  path: "/api/upload",
};

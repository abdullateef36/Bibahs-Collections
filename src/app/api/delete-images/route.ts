import { NextResponse } from "next/server";
import crypto from "crypto";

type DeleteImagesRequest = {
  urls?: string[];
  publicIds?: string[];
};

const extractPublicId = (url: string): string | null => {
  const uploadMarker = "/upload/";
  const markerIndex = url.indexOf(uploadMarker);
  if (markerIndex === -1) return null;

  const afterUpload = url.slice(markerIndex + uploadMarker.length);
  const withoutQuery = afterUpload.split("?")[0];
  const withoutVersion = withoutQuery.replace(/^v\d+\//, "");
  const lastDot = withoutVersion.lastIndexOf(".");
  if (lastDot === -1) return null;

  return decodeURIComponent(withoutVersion.slice(0, lastDot));
};

export async function POST(request: Request) {
  try {
    const { urls = [], publicIds = [] } = (await request.json()) as DeleteImagesRequest;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary configuration missing" },
        { status: 500 }
      );
    }

    const derivedIds = urls
      .map(extractPublicId)
      .filter((id): id is string => Boolean(id));

    const idsToDelete = [...publicIds, ...derivedIds].filter(Boolean);

    if (idsToDelete.length === 0) {
      return NextResponse.json({ error: "No valid public IDs provided" }, { status: 400 });
    }

    const timestamp = Math.floor(Date.now() / 1000);

    const results = await Promise.all(
      idsToDelete.map(async (publicId) => {
        const stringToSign = `invalidate=true&public_id=${publicId}&timestamp=${timestamp}`;
        const signature = crypto
          .createHash("sha1")
          .update(stringToSign + apiSecret)
          .digest("hex");

        const form = new FormData();
        form.append("public_id", publicId);
        form.append("timestamp", String(timestamp));
        form.append("api_key", apiKey);
        form.append("signature", signature);
        form.append("invalidate", "true");

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
          {
            method: "POST",
            body: form,
          }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok || data?.result === "error") {
          return {
            publicId,
            ok: false,
            error: data?.error?.message || data?.result || "Delete failed",
          };
        }

        return { publicId, ok: true, result: data?.result ?? "ok" };
      })
    );

    const failures = results.filter((result) => !result.ok);

    if (failures.length > 0) {
      return NextResponse.json(
        { error: "Some images failed to delete", failures },
        { status: 500 }
      );
    }

    return NextResponse.json({ deleted: results });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

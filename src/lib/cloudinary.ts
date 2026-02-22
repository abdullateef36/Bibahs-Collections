export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
}

export const uploadToCloudinary = async (file: File): Promise<CloudinaryUploadResult> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to upload image");
  }

  return response.json();
};

export const deleteImagesFromCloudinary = async (imageUrls: string[]): Promise<void> => {
  if (!imageUrls || imageUrls.length === 0) return;

  const cloudinaryUrls = imageUrls.filter((url) => url.includes("res.cloudinary.com/"));
  if (cloudinaryUrls.length === 0) return;

  const response = await fetch("/api/delete-images", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ urls: cloudinaryUrls }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.error || "Failed to delete images");
  }
};

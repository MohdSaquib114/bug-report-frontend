import type { BugReportData } from "./types";

export interface CompressOptions {
  maxDimension?: number;
  quality?: number;
  mimeType?: "image/jpeg" | "image/webp";
  filename?: string;
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Couldn't read the captured screenshot"));
    image.src = dataUrl;
  });
}

/**
 * Downscale and re-encode a captured screenshot so uploads stay small.
 * The widget hands over PNG data URLs; this returns a compressed image File
 * ready to append to a multipart form.
 */
export async function compressDataUrlToFile(
  dataUrl: string,
  { maxDimension = 1600, quality = 0.82, mimeType = "image/jpeg", filename }: CompressOptions = {},
): Promise<File> {
  const image = await loadImage(dataUrl);

  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not supported in this browser");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, mimeType, quality),
  );
  if (!blob) throw new Error("Couldn't encode the screenshot");

  const extension = mimeType === "image/webp" ? "webp" : "jpg";
  return new File([blob], filename ?? `screenshot-${Date.now()}.${extension}`, {
    type: mimeType,
  });
}

/**
 * Convert a widget payload into a multipart body: the text fields plus each
 * screenshot as a compressed image file.
 */
export async function buildReportFormData(data: BugReportData): Promise<FormData> {
  const form = new FormData();
  form.append("title", data.title);
  form.append("description", data.description);
  form.append("timestamp", data.timestamp);
  form.append("meta", JSON.stringify(data.meta));

  for (const [index, screenshot] of data.screenshots.entries()) {
    const file = await compressDataUrlToFile(screenshot.dataUrl, {
      filename: `${screenshot.id || `screenshot-${index + 1}`}.jpg`,
    });
    form.append("screenshots", file);
  }

  return form;
}

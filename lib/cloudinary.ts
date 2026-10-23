import "server-only";

import { v2 as cloudinary } from "cloudinary";

const folderRoot = process.env.CLOUDINARY_FOLDER ?? "shivnarayan-portfolio";

function getConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, apiKey, apiSecret };
}

export function isCloudinaryConfigured() {
  return Boolean(getConfig());
}

export async function uploadImageBuffer(
  buffer: Buffer,
  folder = "projects",
): Promise<string> {
  const config = getConfig();
  if (!config) {
    throw new Error("Cloudinary is not configured.");
  }

  cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret,
    secure: true,
  });

  return new Promise<string>((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder: `${folderRoot}/${folder}`,
        resource_type: "image",
        transformation: [
          { width: 2_400, height: 2_400, crop: "limit" },
          { quality: "auto:good", fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(error ?? new Error("Cloudinary did not return a URL."));
          return;
        }
        resolve(result.secure_url);
      },
    );

    upload.end(buffer);
  });
}

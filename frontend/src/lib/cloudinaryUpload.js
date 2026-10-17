// Cloudinary config - cloud_name must match your Cloudinary account
const CLOUDINARY_CLOUD_NAME = "bnnuxuzg";
const CLOUDINARY_UPLOAD_PRESET = "chatify_unsigned"; // unsigned preset created in Cloudinary dashboard

/**
 * Upload a file directly to Cloudinary from the browser.
 * Avoids sending large base64 data through the Express backend.
 * @param {File} file - The File object from the file input
 * @param {(progress: number) => void} [onProgress] - Optional upload progress callback (0-100)
 * @returns {Promise<{ url: string, resourceType: string, publicId: string }>}
 */
export async function uploadToCloudinary(file, onProgress) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", "chatify");

  const resourceType =
    file.type.startsWith("video/") || file.type.startsWith("audio/")
      ? "video" // Cloudinary uses "video" resource_type for both audio and video
      : "auto";

  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    if (onProgress) {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      });
    }

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve({
            url: data.secure_url,
            resourceType: data.resource_type,
            publicId: data.public_id,
            format: data.format,
          });
          // eslint-disable-next-line no-unused-vars
        } catch (err) {
          reject(new Error("Invalid Cloudinary response"));
        }
      } else {
        try {
          const errData = JSON.parse(xhr.responseText);
          reject(new Error(errData?.error?.message || `Upload failed: HTTP ${xhr.status}`));
        } catch {
          reject(new Error(`Upload failed: HTTP ${xhr.status}`));
        }
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Network error during upload")));
    xhr.addEventListener("abort", () => reject(new Error("Upload aborted")));

    xhr.open("POST", url);
    xhr.send(formData);
  });
}

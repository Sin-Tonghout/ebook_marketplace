import { COVER_MIN_H, COVER_MIN_W } from "@/types/publish";

export interface ProcessedCover {
  dataUrl: string;
  width: number;
  height: number;
}

const PREVIEW_WIDTH = 600;

/**
 * Reads an image file, checks its dimensions, and returns a downscaled JPEG
 * data URL small enough to keep in localStorage.
 */
export function processCoverImage(file: File): Promise<ProcessedCover> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      const { naturalWidth: w, naturalHeight: h } = img;

      if (w < COVER_MIN_W || h < COVER_MIN_H) {
        reject(
          new Error(
            `This image is ${w}×${h}px. Covers need to be at least ${COVER_MIN_W}×${COVER_MIN_H}px.`
          )
        );
        return;
      }

      const scale = Math.min(1, PREVIEW_WIDTH / w);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(w * scale);
      canvas.height = Math.round(h * scale);

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Your browser couldn't process this image."));
        return;
      }

      // White base so transparent PNGs don't turn black when saved as JPEG
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      resolve({ dataUrl: canvas.toDataURL("image/jpeg", 0.85), width: w, height: h });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("This image couldn't be read. Try a different file."));
    };

    img.src = url;
  });
}
import { api, ApiError } from "@/lib/api";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export interface UploadHandle<T> {
  promise: Promise<T>;
  abort: () => void;
}

interface Handlers {
  /** 0 to 100 while the file is being sent. */
  onProgress?: (percent: number) => void;
  /** The whole file has been sent; the server is now checking it. */
  onSent?: () => void;
}

/**
 * Sends one file to the API as multipart/form-data. fetch() can't report upload
 * progress, so this uses XMLHttpRequest. Cookies are sent so the API knows who
 * is uploading.
 */
export function uploadFile<T>(
  path: string,
  file: Blob,
  filename: string,
  handlers: Handlers = {}
): UploadHandle<T> {
  const xhr = new XMLHttpRequest();

  const promise = new Promise<T>((resolve, reject) => {
    xhr.open("POST", `${BASE}${path}`);
    xhr.withCredentials = true;

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) handlers.onProgress?.(Math.round((e.loaded / e.total) * 100));
    };
    xhr.upload.onload = () => handlers.onSent?.();

    xhr.onload = () => {
      let json: { success?: boolean; data?: T; message?: string; code?: string } | null = null;
      try {
        json = JSON.parse(xhr.responseText);
      } catch {
        /* response was not JSON */
      }
      if (xhr.status >= 200 && xhr.status < 300 && json?.success) {
        resolve(json.data as T);
      } else {
        reject(
          new ApiError(
            json?.code ?? "UNKNOWN",
            json?.message ?? "Something went wrong. Please try again.",
            xhr.status
          )
        );
      }
    };
    xhr.onerror = () =>
      reject(
        new ApiError(
          "NETWORK_ERROR",
          "Can't reach the server. Check your connection and try again.",
          0
        )
      );
    xhr.onabort = () => reject(new ApiError("ABORTED", "Upload cancelled.", 0));

    const body = new FormData();
    body.append("file", file, filename);
    xhr.send(body);
  });

  return { promise, abort: () => xhr.abort() };
}

/** Removes an upload that was never attached to a book. Failures are ignored. */
export function discardUpload(id: string): void {
  void api(`/uploads/${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => {});
}
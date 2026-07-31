const MAX_EDGE = 1600;
const TARGET_BYTES = 900 * 1024;
const SKIP_IF_UNDER_BYTES = 400 * 1024;

/**
 * Compress images in the browser before upload so slow networks
 * don't choke on multi‑MB phone photos. Output matches server Sharp target.
 */
export async function compressImageFile(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.size <= SKIP_IF_UNDER_BYTES) {
    return file;
  }

  if (typeof createImageBitmap !== "function") {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const qualities = [0.82, 0.74, 0.66, 0.58];
    let bestBlob: Blob | null = null;

    for (const quality of qualities) {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", quality)
      );
      if (!blob) continue;
      if (!bestBlob || blob.size < bestBlob.size) {
        bestBlob = blob;
      }
      if (blob.size <= TARGET_BYTES) {
        break;
      }
    }

    if (!bestBlob || bestBlob.size >= file.size) {
      return file;
    }

    const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
    return new File([bestBlob], `${baseName}.jpg`, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch {
    return file;
  }
}

export async function compressImageFiles(files: File[]): Promise<File[]> {
  const compressed: File[] = [];
  for (const file of files) {
    compressed.push(await compressImageFile(file));
  }
  return compressed;
}

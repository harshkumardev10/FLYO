/**
 * Cloudinary Image Upload Helper using User's Cloudinary Account (q2hfwqia)
 * Supports .webp validation and automatic client-side .webp optimization.
 */

/**
 * Check if a file is .webp format
 */
export function isWebPFile(file: File): boolean {
  return file.type === 'image/webp' || file.name.toLowerCase().endsWith('.webp');
}

/**
 * Convert any image file (PNG, JPG, JPEG) to WebP format using HTML5 Canvas
 */
export async function convertImageToWebP(file: File, quality = 0.9): Promise<File> {
  // If already webp, return directly
  if (isWebPFile(file)) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('WebP conversion failed'));
            return;
          }
          const baseName = file.name.replace(/\.[^/.]+$/, '');
          const webpFile = new File([blob], `${baseName}.webp`, { type: 'image/webp' });
          resolve(webpFile);
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image for WebP conversion'));
    };

    img.src = objectUrl;
  });
}

/**
 * Upload Image to Cloudinary (with fallback to Data URL)
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'q2hfwqia';
  
  // Try uploading using standard upload presets (ml_default, unsigned, or flyo_unsigned)
  const presets = ['ml_default', 'unsigned', 'flyo_unsigned'];
  
  for (const preset of presets) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', preset);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
      );

      if (res.ok) {
        const data = await res.json();
        if (data.secure_url) {
          return data.secure_url;
        }
      }
    } catch {
      // Continue to next preset
    }
  }

  // Fallback: Data URL if unsigned preset is not created in Cloudinary dashboard yet
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert image'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Dedicated Article Image Uploader:
 * Converts/validates to .webp format only for optimal web performance & SEO rules.
 */
export async function uploadArticleImageWebP(
  file: File,
  autoConvert = true
): Promise<{ url: string; fileName: string; isConverted: boolean }> {
  let targetFile = file;
  let isConverted = false;

  if (!isWebPFile(file)) {
    if (!autoConvert) {
      throw new Error('Only .webp image format is allowed. Please select a .webp image.');
    }
    try {
      targetFile = await convertImageToWebP(file);
      isConverted = true;
    } catch (e) {
      throw new Error('Image format must be .webp. Please convert or select a .webp image.');
    }
  }

  const url = await uploadImageToCloudinary(targetFile);
  return {
    url,
    fileName: targetFile.name,
    isConverted,
  };
}

/**
 * Cloudinary Image Upload Helper using User's Cloudinary Account (q2hfwqia)
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

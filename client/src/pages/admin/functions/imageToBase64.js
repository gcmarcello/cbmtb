import { Buffer } from "buffer";

export function imageToBase64(image) {
  return new Promise((resolve, reject) => {
    if (image) {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => {
        const binaryData = Buffer.from(reader.result, "base64");
        const sizeInBytes = binaryData.length;
        const sizeInKilobytes = (sizeInBytes / 1024).toFixed(2);
        resolve({ image: reader.result, size: sizeInKilobytes });
      };
      reader.onerror = (error) => reject(error);
    }
  });
}

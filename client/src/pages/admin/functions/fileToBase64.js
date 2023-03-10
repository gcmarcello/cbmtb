import { Buffer } from "buffer";

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const binaryData = Buffer.from(reader.result, "base64");
        const sizeInBytes = binaryData.length;
        const sizeInKilobytes = (sizeInBytes / 1024).toFixed(2);
        resolve({ file: reader.result, size: sizeInKilobytes });
      };
      reader.onerror = (error) => reject(error);
    }
  });
}

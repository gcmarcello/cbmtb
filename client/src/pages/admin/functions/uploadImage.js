import imageCompression from "browser-image-compression";

async function uploadImage(blobInfo) {
  const imageCompressionOptions = {
    maxSizeMB: 0.4,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  const compressedFile = await imageCompression(blobInfo, imageCompressionOptions);

  const myHeaders = new Headers();
  myHeaders.append("token", localStorage.token);

  const formData = new FormData();
  formData.append("file", new File([compressedFile], compressedFile.name));

  const response = await fetch("/api/bucket/", { method: "POST", headers: myHeaders, body: formData });
  const parseResponse = await response.json();
  if (!parseResponse) {
    return null;
  }
  return parseResponse;
}

export default uploadImage;

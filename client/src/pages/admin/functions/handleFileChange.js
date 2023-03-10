export function handleFileChange(event, setIsLoading, fileToBase64, register, setFileSize, unregister) {
  setIsLoading(true);
  const file = event.target.files[0];
  if (file) {
    fileToBase64(file).then((data) => {
      register("file", { value: data.file, required: true });
      register("fileSize", { value: data.size });
      setFileSize(data.size);
    });
  } else {
    unregister("file");
  }
  setIsLoading(false);
}

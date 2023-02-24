import { toast } from "react-toastify";

export function parseDateToForm(date) {
  let dateToParse = new Date(date);
  let dateToParseDay = String(dateToParse.getDate()).padStart(2, 0);
  let dateToParseMonth = String(dateToParse.getMonth() + 1).padStart(2, 0);
  let dateToParseYear = String(dateToParse.getFullYear());
  return `${dateToParseYear}-${dateToParseMonth}-${dateToParseDay}`;
}

export function handleChange(e, type, formInputs, setFormInputs) {
  if (type === "text") {
    setFormInputs({ ...formInputs, [e.target.name]: e.target.value });
  } else if (type === "checkbox") {
    setFormInputs({ ...formInputs, [e.target.name]: !formInputs.general });
  } else {
    setFormInputs({ ...formInputs, [type]: e });
  }
}

export function handleFileChange(e, setSelectedImage, setIsImageSelected, imagePreview, setImagePreview) {
  setSelectedImage(e.target.files[0]);
  setIsImageSelected(true);
  URL.revokeObjectURL(imagePreview);
  setImagePreview(URL.createObjectURL(e.target.files[0]));
}

export function cancelFileUpload(setSelectedImage, setImagePreview, setBase64Image) {
  setSelectedImage(null);
  setImagePreview(null);
  setBase64Image(null);
}

export function resetForm(type, formInputs, setFormInputs, category, setCategory) {
  const emptyState = {};

  if (type !== "category") {
    const keys = Object.keys(formInputs);
    keys.forEach((key) => {
      emptyState[key] = "";
    });
    setFormInputs(emptyState);
  } else {
    const keys = Object.keys(category);
    keys.forEach((key) => {
      emptyState[key] = "";
    });

    setCategory(emptyState);
  }
}

export async function handleDelete(e, id, setEventChange) {
  e.preventDefault();
  setEventChange(true);
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("token", localStorage.token);

    const response = await fetch(`/api/events/delete/${id}`, {
      method: "DELETE",
      headers: myHeaders,
    });
    const parseResponse = await response.json();
    toast[parseResponse.type](parseResponse.message, { theme: "colored" });
    setEventChange(false);
  } catch (err) {
    console.log(err);
  }
}

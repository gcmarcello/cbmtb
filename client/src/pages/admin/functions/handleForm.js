export const handleFileChange = (e, setSelectedImage, setIsImageSelected, imagePreview, setImagePreview) => {
  setSelectedImage(e.target.files[0]);
  setIsImageSelected(true);
  URL.revokeObjectURL(imagePreview);
  setImagePreview(URL.createObjectURL(e.target.files[0]));
};

export const handleChange = (e, type, formInputs, setFormInputs) => {
  if (type === "text") {
    setFormInputs({ ...formInputs, [e.target.name]: e.target.value });
  } else {
    setFormInputs({ ...formInputs, [type]: e });
  }
};

export const resetForm = (type, formInputs, setFormInputs, category, setCategory) => {
  const emptyState = {};
  if (type === "event") {
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
};

export const handleSubmit = async (e, setIsLoading, setEventChange, setIsImageSubmitted) => {
  e.preventDefault();
  try {
    setIsLoading(true);
    setEventChange(true);
    setIsImageSubmitted(true);
  } catch (err) {
    setIsLoading(false);
    console.log(err);
  }
};

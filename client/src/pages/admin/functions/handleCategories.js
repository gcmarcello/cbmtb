import { resetForm } from "./handleForm";

export function handleCategoryChange(category, setCategory, e) {
  setCategory({ ...category, [e.target.name]: e.target.value });
}

export function deleteCategory(formInputs, setFormInputs, e, index) {
  e.preventDefault();
  setFormInputs({ ...formInputs, categories: formInputs.categories.filter((category) => category.index !== index) });
}

export function handleCategorySubmit(formInputs, setFormInputs, e, resetForm, category, setCategory) {
  e.preventDefault();
  setFormInputs({
    ...formInputs,
    categories: [
      ...formInputs.categories,
      {
        name: category.categoryName,
        minAge: Number(category.minAge),
        maxAge: Number(category.maxAge),
        gender: category.categoryGender,
        index: Number(formInputs.categories.length + 1),
      },
    ],
  });
  resetForm("category", formInputs, setFormInputs, category, setCategory);
}

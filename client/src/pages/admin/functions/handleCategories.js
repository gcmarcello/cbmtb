import { toast } from "react-toastify";

export async function fetchCategories(eventId, setCategories) {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("token", localStorage.token);
    const response = await fetch(`/api/categories/${eventId}`, {
      method: "GET",
      headers: myHeaders,
    });
    const parseResponse = await response.json();
    setCategories(parseResponse);
  } catch (err) {
    console.log(err);
  }
}

export function handleNewCategoryChange(e, setNewCategory, newCategory) {
  setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
}

export function handleCategoryChange(e, categoryId, categories, setCategories) {
  const updatedCategories = categories.map((category) => {
    if (category.category_id === categoryId) {
      return { ...category, [e.target.name]: e.target.value };
    }
    return category;
  });
  setCategories(updatedCategories);
}

export function deleteCategory(formInputs, setFormInputs, e, index) {
  e.preventDefault();
  setFormInputs({ ...formInputs, categories: formInputs.categories.filter((category) => category.index !== index) });
}

export async function deletedSavedCategory(e, id, categories, setCategories) {
  e.preventDefault();
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("token", localStorage.token);
    const response = await fetch(`/api/categories/${id}`, {
      method: "DELETE",
      headers: myHeaders,
    });
    const parseResponse = await response.json();
    setCategories(categories.filter((category) => category.category_id !== id));
    toast.success(parseResponse.message, { theme: "colored" });
  } catch (err) {
    toast.error(err.message, { theme: "colored" });
    console.log(err);
  }
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

export async function createCategoryEditingEvent(
  e,
  id,
  setIsLoading,
  setNewCategory,
  setCategoryChange,
  categoryName,
  categoryMinAge,
  categoryMaxAge,
  categoryGender
) {
  e.preventDefault();
  setCategoryChange(true);
  try {
    setIsLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("token", localStorage.token);

    const body = { categoryName, categoryMinAge, categoryMaxAge, categoryGender };

    const response = await fetch(`/api/categories/${id}`, {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(body),
    });
    const parseResponse = await response.json();
    toast.success(parseResponse.message, { theme: "colored" });
    setNewCategory({
      categoryName: "",
      categoryMinAge: "",
      categoryMaxAge: "",
      categoryGender: "",
    });
  } catch (error) {
    toast.error(error.message, { theme: "colored" });
  } finally {
    setCategoryChange(false);
    setIsLoading(false);
  }
}

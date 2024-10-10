// lib/category.js
import api from "@/app/api";

// Function to fetch a category name by ID
export const getCategoryName = async (categoryId) => {
  try {
    const categoryResponse = await api.get(`/api/category/${categoryId}`);
    return categoryResponse.data.name; // Return only the category name
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du nom de la catégorie",
      error,
    );
    throw error; // Re-throw the error to handle it outside the function if needed
  }
};

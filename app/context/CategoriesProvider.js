"use client";
import React, { createContext, useState, useEffect } from "react";
import api from "@/app/api";
import { useRouter } from "next/navigation";

export const CategoriesContext = createContext();

export const CategoriesProvider = ({ children }) => {
  const router = useRouter();
  const [categories, setCategories] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(false);

  const fetchCategories = async () => {
    if (fetchLoading || categories !== null) return;

    setFetchLoading(true);

    try {
      const response = await api.get("/api/category");
      console.log("fetchCategories - categories context");
      setCategories(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
    } finally {
      setFetchLoading(false);
    }
  };

  const addCategory = async (newCategoryData) => {
    try {
      const response = await api.post("/api/category", newCategoryData);
      setCategories((prevCategories) => [...prevCategories, response.data]);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la catégorie :", error);
    }
  };

  const updateCategory = async (updatedCategoryData) => {
    const id = updatedCategoryData.get("_id");
    try {
      const response = await api.put(
        `/api/category/${id}`,
        updatedCategoryData,
      );
      console.log(response.data);
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category._id === id ? response.data : category,
        ),
      );
      router.push("/admin/produits/categories");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la catégorie :", error);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      await api.delete(`/api/category/${categoryId}`);
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category._id !== categoryId),
      );
      console.log(categories);
    } catch (error) {
      console.error("Erreur lors de la suppression de la catégorie :", error);
    }
  };

  const getPopulateCategory = async (slug) => {
    try {
      const response = await api.get(`/api/category/populateCategory/${slug}`);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        setCategories,
        fetchCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        getPopulateCategory,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

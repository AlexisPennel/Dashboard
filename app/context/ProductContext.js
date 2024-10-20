"use client";
import React, { createContext, useState, useContext } from "react";
import api from "@/app/api";
import { useRouter } from "next/navigation";
import { CategoriesContext } from "./CategoriesProvider";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const router = useRouter();
  const [products, setProducts] = useState(null);
  const { categories, setCategories } = useContext(CategoriesContext);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchDatas = async () => {
    if (fetchLoading || (products !== null && categories !== null)) return;

    setFetchLoading(true);

    try {
      const promises = [];
      if (products === null) {
        console.log("Product fetch - product Context");
        const productPromise = api.get("api/product");
        promises.push(productPromise);
      }

      if (categories === null) {
        console.log("category fetch - product Context");
        const categoryPromise = api.get("api/category");
        promises.push(categoryPromise);
      }

      const [responseProducts, responseCategories] =
        await Promise.all(promises);

      if (responseProducts) {
        setProducts(responseProducts.data);
      }

      if (responseCategories) {
        setCategories(responseCategories.data);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des produits et catégories :",
        error,
      );
    }
  };

  const loadDatas = () => {
    fetchDatas();
    setFetchLoading(false);
  };

  // Function to update category products in context without API call
  const updateCategoryInContext = (categoryId, productId, action) => {
    setCategories((prevCategories) => {
      return prevCategories.map((category) => {
        if (category._id === categoryId) {
          let updatedProductIds;
          if (action === "add") {
            updatedProductIds = [...category.productIds, productId];
          } else if (action === "remove") {
            updatedProductIds = category.productIds.filter(
              (id) => id !== productId,
            );
          }
          return { ...category, productIds: updatedProductIds };
        }
        return category;
      });
    });
  };

  // Add a new product and update category
  const addProduct = async (newProduct, categoryId) => {
    try {
      const response = await api.post("api/product", newProduct);
      const createdProduct = response.data;

      // Update the category in the context
      updateCategoryInContext(categoryId, createdProduct._id, "add");

      setProducts((prevProducts) => [...prevProducts, createdProduct]);
      router.push("/admin/produits/liste");
    } catch (error) {
      console.error("Erreur lors de la création du produit :", error);
    }
  };

  const updateProduct = async (
    updatedProduct,
    previousCategoryIds, // Changer pour un tableau d'IDs de catégories précédentes
    newCategoryIds, // Changer pour un tableau d'IDs de nouvelles catégories
  ) => {
    const id = updatedProduct.get("id");

    // Vérification si l'ID du produit est présent
    if (!id) {
      console.error("ID du produit manquant");
      return;
    }

    try {
      const response = await api.put(`api/product/${id}`, updatedProduct);
      const modifiedProduct = response.data.product;

      // Mettre à jour les associations de catégories
      previousCategoryIds.forEach((previousCategoryId) => {
        if (!newCategoryIds.includes(previousCategoryId)) {
          console.log("Retrait de la catégorie");
          updateCategoryInContext(
            previousCategoryId, // Passe l'ID de la catégorie ici
            modifiedProduct._id,
            "remove",
          );
        }
      });

      newCategoryIds.forEach((newCategoryId) => {
        if (!previousCategoryIds.includes(newCategoryId)) {
          console.log("Ajout à la nouvelle catégorie");
          updateCategoryInContext(
            newCategoryId, // Passe l'ID de la catégorie ici
            modifiedProduct._id,
            "add",
          );
        }
      });

      // Mettre à jour le produit dans le contexte
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === modifiedProduct._id ? modifiedProduct : product,
        ),
      );

      // Rediriger l'utilisateur vers la liste des produits
      router.push("/admin/produits/liste");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du produit :", error);
      setIsError(true);
    }
  };

  // Delete a product and update category in context
  const deleteProduct = async (productSlug, productId, categoryIds) => {
    try {
      await api.delete(`api/product/${productSlug}`);

      // Remove the product ID from its category in context
      categoryIds.forEach((categoryId) => {
        updateCategoryInContext(categoryId, productId, "remove");
      });

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId),
      );
      router.push("/admin/produits/liste");
    } catch (error) {
      console.error("Erreur lors de la suppression du produit :", error);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        categories,
        setCategories,
        fetchDatas,
        loadDatas,
        addProduct,
        updateProduct,
        deleteProduct,
        isError,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

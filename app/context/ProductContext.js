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

  // Update a product and manage category association
  const updateProduct = async (
    updatedProduct,
    previousCategoryId,
    newCategoryId,
  ) => {
    const id = updatedProduct.get("id");
    console.log(previousCategoryId);
    console.log(newCategoryId);
    try {
      const response = await api.put(`api/product/${id}`, updatedProduct);
      const modifiedProduct = response.data.product;

      // If the category has changed, update both categories in context
      if (previousCategoryId !== newCategoryId) {
        console.log("modif cat");
        updateCategoryInContext(
          previousCategoryId,
          modifiedProduct._id,
          "remove",
        );
        updateCategoryInContext(newCategoryId, modifiedProduct._id, "add");
      }
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === modifiedProduct._id ? modifiedProduct : product,
        ),
      );
      router.push("/admin/produits/liste");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du produit :", error);
      setIsError(true);
    }
  };

  // Delete a product and update category in context
  const deleteProduct = async (productSlug, productId, categoryId) => {
    try {
      await api.delete(`api/product/${productSlug}`);

      // Remove the product ID from its category in context
      updateCategoryInContext(categoryId, productId, "remove");

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

"use client";
import React, { createContext, useState } from "react";
import api from "@/app/api";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState(null);
  const [categories, setCategories] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(false);

  const fetchDatas = async () => {
    if (fetchLoading || (products !== null && categories !== null)) return;

    setFetchLoading(true);

    try {
      const promises = [];

      if (products === null) {
        const productPromise = api.get("api/product");
        promises.push(productPromise);
      }

      if (categories === null) {
        const categoryPromise = api.get("api/category");
        promises.push(categoryPromise);
      }

      // Attends que toutes les promesses soient résolues
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

  return (
    <AppContext.Provider
      value={{
        products,
        setProducts,
        categories,
        setCategories,
        fetchDatas,
        loadDatas,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

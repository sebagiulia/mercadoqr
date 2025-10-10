import { useState, useEffect } from "react";
import { Product } from "../domain/entities/Product";
import { BackProductsRepository } from "../infrastructure/products/BackProductsRepository";

const repository = new BackProductsRepository();

export function useProducts(token: string, onUnauthorized?: () => void) {
  const [products, setProducts] = useState<Product[]|null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reload, setReload] = useState(false);
  

  const fetchProducts = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await repository.getAll(token);
      if (response.success && response.data) setProducts(response.data);
      else {
        if (response.error?.code === "401" || response.error?.code === "403") {
          onUnauthorized?.();
        } else {
          throw new Error(response.error?.message || "Error cargando productos");
        }
      }
    } catch (e) {
      throw new Error("Error cargando productos");
    } finally {
      setLoading(false);
    }
  };

  const saveProduct = async (product: Product, isNew: boolean) => {
    setSaving(true);
    try {
      if (isNew) {
        const response = await repository.create(token, product);
        if (!response.success) {
          console.error("Error creando producto:", response.error);
          throw new Error(response.error?.message || "Error creando producto");
        }
        } else {
        const response = await repository.update(token, product.id, product);
        if (!response.success) {
          console.error("Error actualizando producto:", response.error);
          throw new Error(response.error?.message || "Error actualizando producto");
        }
        }
      setReload(!reload);
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id: number) => {
    setSaving(true);
    try {
      const response = await repository.delete(token, id);
      if (!response.success) {
        console.error("Error eliminando producto:", response.error);
        throw new Error(response.error?.message || "Error eliminando producto");
      }
      setReload(!reload); 
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token, reload]);

  return { products, loading, saving, fetchProducts, saveProduct, deleteProduct };
}

import { useState, useEffect } from "react";
import { Product } from "../domain/entities/Product";
import { BackProductsRepository } from "../infrastructure/products/BackProductsRepository";

const repository = new BackProductsRepository();

export function useProducts(token: string, onUnauthorized?: () => void) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
          console.error("Error cargando productos:", response.error?.message || "Error desconocido");
        }
      }
    } catch (e) {
      console.error("Error en fetchProducts:", e);
    } finally {
      setLoading(false);
    }
  };

  const saveProduct = async (product: Product, isNew: boolean) => {
    setSaving(true);
    try {
      if (isNew) {
        const response = await repository.create(token, product);
        if (!response.success) console.error("Error creando producto:", response.error);
      } else {
        const response = await repository.update(token, product.id, product);
        if (!response.success) console.error("Error actualizando producto:", response.error);
      }
      await fetchProducts();
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id: number) => {
    setSaving(true);
    try {
      const response = await repository.delete(token, id);
      if (!response.success) console.error("Error eliminando producto:", response.error);
      await fetchProducts();
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token]);

  return { products, loading, saving, fetchProducts, saveProduct, deleteProduct };
}

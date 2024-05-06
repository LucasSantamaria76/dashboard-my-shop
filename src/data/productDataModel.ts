import { ProductsResponse } from '@/types';
import { ProductType } from '@/types/product';

export const productDataModel = (data: ProductsResponse): ProductType => {
  return {
    description: data.description,
    gender: data.gender,
    name: data.name,
    slug: data.slug,
    productId: data.product_id,
    images: data.product_images,
    brand: data.brand.name,
    subcategory: data.subcategories.name,
    feature: data.feature,
    categories: {
      name: data.subcategories.categories.name,
      id: data.subcategories.categories.category_id
    },
    inventory: data.inventory.map((item) => ({
      price: item.price,
      stock: item.stock,
      discount: item.discount,
      inventoryId: item.inventory_id,
      size: item.public_inventory_size_id_fkey,
      color: item.public_inventory_color_id_fkey,
      subColor: item.public_inventory_sub_color_id_fkey
    }))
  };
};

export interface Product {
  id: string;
  shopId: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  images: string[];
  inventory: number;
  tags?: string[];
  vendor?: string;
}
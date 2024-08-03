export interface Product {
  product_id: number;
  code: string;
  image: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  unit_id: number;
  category: {
    category_id: number;
    name: string;
    description: string;
  };
}
export interface Product {
  product_id: number;
  image: string;
  product_name: string;
  price: number;
  category: {
    category_id: number;
    name: string;
  };
  stock_quantity: number;
  description: string;
}

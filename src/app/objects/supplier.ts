export class Supplier {
    key: string;
    name: string;
    address:string;
    city:string;
    state:string;
    postalCode:string;
    email:string;
    phone:string; 
    products: Product[];
  }
  export class Product {
    prod_code:string;
    prod_name:string;
    prod_brand:string;
    prod_price:string;
  }
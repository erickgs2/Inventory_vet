import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import { Product } from '../objects/product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private dbPath = '/products';
  productsRef: AngularFireList<Product> = null;
  constructor(
    public db: AngularFireDatabase
  ) {
    this.productsRef = db.list(this.dbPath);  
   }

   createProduct(prod: Product): void {
    this.productsRef.push(prod);
  }
 
  updateProduct(prod:Product, key): Promise<void> {
    return this.productsRef.update(key, prod);
  }
 
  deleteProduct(key: string): Promise<void> {
    return this.productsRef.remove(key);
  }
 
  getProductsList(): AngularFireList<Product> {
    return this.productsRef;
  }

  deleteAll(): Promise<void> {
    return this.productsRef.remove();
  }
}

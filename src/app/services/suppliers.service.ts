import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import { Supplier } from '../objects/supplier';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {

  private dbPath = '/suppliers';
  customersRef: AngularFireList<Supplier> = null;
  constructor(
    public db: AngularFireDatabase ) {
      this.customersRef = db.list(this.dbPath);  
  }
 
  createCustomer(customer: Supplier): void {
    this.customersRef.push(customer);
  }
  createProd(prod, supp: String, index): void {
    var temp = this.db.list(this.dbPath+'/'+supp+'/products');
    temp.set(index+'',prod);
  }
 
  updateCustomer(supp:Supplier): Promise<void> {
    return this.customersRef.update(supp.key, supp);
  }
  updateProd(supp,prod, index): Promise<void> {
    var temp = this.db.list(this.dbPath+'/'+supp+'/products');
    return temp.set(index+'',prod);
  }
 
  deleteCustomer(key: string): Promise<void> {
    return this.customersRef.remove(key);
  }
  deleteProd(key:string,products):Promise<void> {
    var temp = this.db.list(this.dbPath+'/'+key);
    // var tempProd = this.db.list(this.dbPath+'/'+key+'/products');
    // tempProd.remove('0').then(k => {
    //   console.log(products)
    return temp.set('products', products);
    // })
  }
 
  getCustomersList(): AngularFireList<Supplier> {
    return this.customersRef;
  }

  deleteAll(): Promise<void> {
    return this.customersRef.remove();
  }
}

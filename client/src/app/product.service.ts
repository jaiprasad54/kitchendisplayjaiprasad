import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { environment } from '../environments/environment';

@Injectable()
export class ProductService {
  private apiUrl = environment.apiUrl+'/products';
  
  constructor(private http: Http) { }
  
  getProductsByIds(ids: string[]){
  	return this.http.get(this.apiUrl+'?id='+ids.join(','))
  		   .toPromise()
  		   .then(res => res.json())
  		   .catch(err => console.log(err));
  }



}

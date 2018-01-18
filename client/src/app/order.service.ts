import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { environment } from '../environments/environment';

@Injectable()
export class OrderService {
  private apiUrl = environment.apiUrl+'/orders';

  constructor(private http: Http) { }
  
  getTodaysOrders(): Promise<any>{
  	let currentDate = this.getDateTimeInFormat(new Date());
    return this.http.get(this.apiUrl+'?date='+currentDate+'&status=pending')
  			 .toPromise()
  			 .then(this.handleData)
  			 .catch(this.handleError)
  }

  updateOrder(order:any):Promise<any>{
    return this.http
               .put(this.apiUrl+'/'+order._id, order)
               .toPromise()
               .then(this.handleData)
               .catch(this.handleError);
  }

  handleData(res: any){
    let body = res.json();
    return body || {};
  }

  handleError(err: any){
    return Promise.reject(err.message || err);
  }

  getDateTimeInFormat(date: Date): string{
  	var tzoffset = date.getTimezoneOffset() * 60000; //offset in milliseconds
	  var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1); 
	  return localISOTime && localISOTime.split('.')[0].replace('T', ' ');
  }
}

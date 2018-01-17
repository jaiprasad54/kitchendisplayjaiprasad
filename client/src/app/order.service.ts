import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { environment } from '../environments/environment';

@Injectable()
export class OrderService {
  private apiUrl = environment.apiUrl+'/orders';

  constructor(private http: Http) { }
  
  getTodaysOrders(): Promise<any>{
  	let currentDate = this.getDateTimeInFormat(new Date());
    console.log('currentDate', currentDate);
    console.log('url',this.apiUrl+'?date='+currentDate+'&status=pending');
  	return this.http.get(this.apiUrl+'?date='+currentDate+'&status=pending')
  			 .toPromise()
  			 .then(this.handleData)
  			 .catch(this.handleError)
  }

  /*createTodo(todo:any): Promise<any>{
    return this.http.post(this.apiUrl, todo)
               .toPromise()
               .then(this.handleData)
               .catch(this.handleError)
  }*/
  updateOrder(order:any):Promise<any>{
    return this.http
               .put(this.apiUrl+'/'+order._id, order)
               .toPromise()
               .then(this.handleData)
               .catch(this.handleError);
  }

  handleData(res: any){
    console.log('in handle data');
    let body = res.json();
    console.log('body', body);
    return body || {};
  }

  handleError(err: any){
    console.log('in error',err);
    return Promise.reject(err.message || err);
  }

  getDateTimeInFormat(date: Date): string{
  	var tzoffset = date.getTimezoneOffset() * 60000; //offset in milliseconds
	  var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1); 
	  return localISOTime && localISOTime.split('.')[0].replace('T', ' ');
  }
}

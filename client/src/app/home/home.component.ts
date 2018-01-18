import { Component, OnInit } from '@angular/core';
import { pick,groupBy,map } from 'lodash';
import * as io from 'socket.io-client';
import { environment } from '../../environments/environment';

import {ProductService} from '../product.service';
import {OrderService} from '../order.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private socket;
  private orders: any[] = [];
  private products: any = {};
  list:any[] = [];
  toEditId: any = {};

  constructor(private orderService: OrderService, private productService: ProductService) { }
  
  ngOnInit() {
    
  	this.getDashboardData();
    console.log('connecting socket');
    this.socket = io.connect(environment.socketServerUrl);
    //get updates from server if order data is updated
    var self = this;
    this.socket.on('orderUpdated', result => {
        console.log('order updated', result);
        if(result)
          self.getDashboardData();
    })
  }

  private getDashboardData(){

  	this.orderService.getTodaysOrders()
  					 .then((orders) => {
    					 	this.orders = orders;
    					 	let productIds = map(orders, 'product_id');
                
    					 	return this.productService.getProductsByIds(productIds);
  					 })  	
  					 .then(products => {this.products = groupBy(products, '_id')})
  					 .then(() => {
  					 	this.orders.map(order => {
  					 		order.product = this.products[order['product_id']] && this.products[order['product_id']][0];
  					 	});

  					 	this.list = this.orders;
  					 });
  }

  EditOrder(order: any){
    if(!order) return;
    order.status='done';
    this.orderService.updateOrder(order)
                     .then((order)=>{
                      alert("Order updated successfully");
                      this.getDashboardData();
                     });
  }

}

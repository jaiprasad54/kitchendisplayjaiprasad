import { Component, OnInit } from '@angular/core';
import { pick,groupBy,map } from 'lodash';

import {ProductService} from '../product.service';
import {OrderService} from '../order.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private orders:any[] = [];
  private products:any = {};
  list:any[] = [];
  toEditId: any = {};

  constructor(private orderService: OrderService, private productService: ProductService) { }
  
  ngOnInit() {
  	this.getDashboardData();
  }

  private getDashboardData(){

  	this.orderService.getTodaysOrders()
  					 .then((orders) => {
  					 	console.log('resp orders', orders, this);
  					 	this.orders = orders;
  					 	let productIds = map(orders, 'product_id');
              console.log('productIds', productIds);
  					 	return this.productService.getProductsByIds(productIds);
  					 })  	
  					 .then(products => {this.products = groupBy(products, '_id')})
  					 .then(() => {
  					 	console.log('this.orders', this.orders, this.products);
  					 	this.orders.map(order => {
  					 		order.product = this.products[order['product_id']] && this.products[order['product_id']][0];
  					 	});

  					 	console.log('this.orders', this.orders);
  					 	this.list = this.orders;
  					 });
  }

  EditOrder(order: any){
    if(!order) return;
    console.log('in edit order', order);
    order.status='done';
    this.orderService.updateOrder(order)
                     .then((order)=>{
                      alert("Order updated successfully");
                      this.getDashboardData();
                     });
  }

}

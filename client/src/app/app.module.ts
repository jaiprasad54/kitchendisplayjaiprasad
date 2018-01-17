import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';


import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProductService } from './product.service';
import { OrderService } from './order.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [
  	ProductService,
  	OrderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

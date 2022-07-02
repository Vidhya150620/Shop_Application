import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  url= environment.apiUrl;

  constructor(private Httpclient:HttpClient) { }

  add(data:any){
    return this.Httpclient.post(this.url+ "/product/add",data,{
      headers: new HttpHeaders().set('Content-Type','application/json')
    })
  }

  update(data:any){
    return this.Httpclient.patch(this.url+ "/product/update",data,{
      headers: new HttpHeaders().set('Content-Type','application/json')
    })
  }

  getProduct(){
    return this.Httpclient.get(this.url+"/product/get/");
  }

  updateStatus(data:any){
    return this.Httpclient.patch(this.url+ "/product/updateStatus",data,{
      headers: new HttpHeaders().set('Content-Type','application/json')
    })
  }
  delete(id:any){
    return this.Httpclient.delete(this.url+ "/product/delete/"+id,{
      headers: new HttpHeaders().set('Content-Type','application/json')
    })
  }
}

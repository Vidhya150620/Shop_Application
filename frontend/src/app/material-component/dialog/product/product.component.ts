import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstant } from 'src/app/shared/global-constant';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();
  productForm:any = FormGroup;
  dialogAction:any = "Add";
  action:any = "Add";
  responseMessage:any=[];

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  private formBuilder:FormBuilder,
  private productService: ProductService,
  public dialogRef:MatDialogRef<ProductComponent>,
  private categoryService:CategoryService,
  private snackbar:SnackbarService) { }

  ngOnInit(): void {

    this.productForm = this.formBuilder.group({
      name:[null,[Validators.required,Validators.pattern(GlobalConstant.nameRegex)]],
      categoryId:[null,Validators.required],
      price:[null,Validators.required],
      description:[null,Validators.required],
    })

    if(this.dialogData.action === 'Edit'){
      this.dialogAction = 'Edit';
      this.action = 'Update';
      this.productForm.patchValue(this.dialogData.data);
    }
  }
// getCategorys(){
//   this.categoryService.getCategorys().subscribe((response:any)=>{
//     this.categorys = response;
//   },(error:any)=>{
//     if(error.error?.message){
//       this.responseMessage=error.error?.message;
//     }
//     else{
//       this.responseMessage = GlobalConstant.genericError;
//     }
//     this.snackbar.openSnackBar(this.responseMessage,GlobalConstant.error);
//   })
// }

}

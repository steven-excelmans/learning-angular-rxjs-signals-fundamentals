import {Component, inject} from '@angular/core';

import {AsyncPipe, NgClass, NgFor, NgIf} from '@angular/common';
import {ProductDetailComponent} from '../product-detail/product-detail.component';
import {ProductService} from "../product.service";
import {catchError, EMPTY, tap} from "rxjs";

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, ProductDetailComponent, AsyncPipe]
})
export class ProductListComponent {
  readonly #productService = inject(ProductService);
  readonly selectedProductId$ = this.#productService.productSelected$;

  pageTitle = 'Products';
  errorMessage = '';

  readonly products$ = this.#productService.products$.pipe(
    tap(() => console.log('in component pipeline')),
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  );


  onSelected(productId: number): void {
    this.#productService.productSelected(productId);
  }
}

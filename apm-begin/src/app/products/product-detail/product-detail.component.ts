import {Component, inject} from '@angular/core';

import {AsyncPipe, CurrencyPipe, NgFor, NgIf} from '@angular/common';
import {Product} from '../product';
import {ProductService} from "../product.service";
import {catchError, EMPTY} from "rxjs";
import { CartService } from 'src/app/cart/cart.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe, AsyncPipe]
})
export class ProductDetailComponent {
  readonly #productService = inject(ProductService);
  readonly #cartService = inject(CartService);
  readonly product$ = this.#productService.product$.pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  errorMessage = '';
  // pageTitle = this.product ? `Product Detail for: ${this.product.productName}` : 'Product Detail';
  pageTitle = 'Product Detail';

  addToCart(product: Product): void {
    this.#cartService.addToCart(product);
  }
}

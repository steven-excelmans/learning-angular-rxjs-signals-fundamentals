import {Component, computed, inject} from '@angular/core';

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

  product = this.#productService.product;
  errorMessage = this.#productService.productError;

  pageTitle = computed(() => this.product()?.productName || 'Product Detail');

  addToCart(product: Product): void {
    this.#cartService.addToCart(product);
  }
}

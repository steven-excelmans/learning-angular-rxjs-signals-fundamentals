import {Component, inject} from '@angular/core';

import {AsyncPipe, NgClass, NgFor, NgIf} from '@angular/common';
import {ProductDetailComponent} from '../product-detail/product-detail.component';
import {ProductService} from "../product.service";

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, ProductDetailComponent, AsyncPipe]
})
export class ProductListComponent {
  readonly #productService = inject(ProductService);
  selectedProductId = this.#productService.selectedProductId;
  errorMessage = this.#productService.productsError;
  products = this.#productService.products;
  pageTitle = 'Products';

  onSelected(productId: number): void {
    this.#productService.productSelected(productId);
  }
}

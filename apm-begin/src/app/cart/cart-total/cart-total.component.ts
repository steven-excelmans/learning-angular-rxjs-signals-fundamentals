import {Component, inject} from '@angular/core';
import {CurrencyPipe, NgIf} from '@angular/common';
import {CartService} from '../cart.service';

@Component({
  selector: 'sw-cart-total',
  templateUrl: './cart-total.component.html',
  standalone: true,
  imports: [NgIf, CurrencyPipe]
})
export class CartTotalComponent {
  readonly #cartService = inject(CartService);

  cartItems = this.#cartService.cartItems;
  subTotal = this.#cartService.subTotal;
  deliveryFee = this.#cartService.deliveryFee;
  tax = this.#cartService.tax
  totalPrice = this.#cartService.totalPrice;

}

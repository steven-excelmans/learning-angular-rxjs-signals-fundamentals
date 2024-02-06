import {computed, Injectable, signal} from "@angular/core";
import {CartItem} from "./cart";
import {Product} from "../products/product";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<CartItem[]>([]);

  cartCount = computed<number>(() => {
    return this.cartItems().reduce((acc, item) => acc + item.quantity, 0);
  });

  subTotal = computed<number>(() => {
    return this.cartItems().reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  });

  deliveryFee = computed<number>(() => {
    return this.subTotal() >= 50 ? 0 : 5.99;
  });

  tax = computed(() => {
    return Math.round(this.subTotal() * 10.75) / 100;
  });

  totalPrice = computed(() => {
    return this.subTotal() + this.tax() + this.deliveryFee();
  });

  addToCart(product: Product): void {
    this.cartItems.update((items) => [...items, {product, quantity: 1}]);
  }

  updateQuantity(cartItem: CartItem, quantity: number): void {
    this.cartItems.update((items) =>
      items.map((item) => item.product.id === cartItem.product.id ? {...item, quantity} : item));
  }

  removeFromCart(cartItem: CartItem): void {
    this.cartItems.update((items) => items.filter((item) => item.product.id !== cartItem.product.id));
  }
}

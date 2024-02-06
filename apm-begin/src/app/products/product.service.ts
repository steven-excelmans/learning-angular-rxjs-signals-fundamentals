import {computed, inject, Injectable, signal} from '@angular/core';
import {catchError, filter, map, Observable, of, shareReplay, switchMap} from "rxjs";
import {Product, Result} from "./product";
import {HttpClient} from "@angular/common/http";
import {HttpErrorService} from "../utilities/http-error.service";
import {ReviewService} from "../reviews/review.service";
import {Review} from '../reviews/review';
import {toObservable, toSignal} from "@angular/core/rxjs-interop";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  readonly #http = inject(HttpClient);
  readonly #httpErrorService = inject(HttpErrorService);
  readonly #reviewService = inject(ReviewService);

  private productsUrl = 'api/products';

  selectedProductId = signal<number | undefined>(undefined);

  private readonly productsResult$ = this.#http.get<Product[]>(this.productsUrl).pipe(
    map(p => ({data: p} as Result<Product[]>)),
    shareReplay(1),
    catchError(err => of({data: [], error: this.#httpErrorService.formatError(err)} as Result<Product[]>))
  )

  private productsResult = toSignal(this.productsResult$, {initialValue: {data: []} as Result<Product[]>});

  products = computed(() => this.productsResult().data);
  productsError = computed(() => this.productsResult().error);

  product = computed(() => this.productResult()?.data);
  productError = computed(() => this.productResult()?.error);

  productSelected(selectedProductId: number): void {
    this.selectedProductId.set(selectedProductId);
  }

  private productResult$ = toObservable(this.selectedProductId).pipe(
    filter(Boolean),
    switchMap(id => {
      const productUrl = `${this.productsUrl}/${id}`;
      return this.#http.get<Product>(productUrl).pipe(
        switchMap(product => this.getProductWithReviews(product)),
        catchError(err => of({
          data: undefined,
          error: this.#httpErrorService.formatError(err)
        } as Result<Product>))
      );
    }),
    map(p => ({data: p} as Result<Product>)),
  )

  private productResult = toSignal(this.productResult$);

  private getProductWithReviews(product: Product): Observable<Product> {
    if (product.hasReviews) {
      return this.#http.get<Review[]>(this.#reviewService.getReviewUrl(product.id)).pipe(
        map(reviews => ({...product, reviews} as Product)),
      )
    }
    return of(product);
  }
}

import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, catchError, combineLatest, filter, map, Observable, of, shareReplay, switchMap} from "rxjs";
import {Product} from "./product";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {HttpErrorService} from "../utilities/http-error.service";
import {ReviewService} from "../reviews/review.service";
import {Review} from '../reviews/review';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  readonly #http = inject(HttpClient);
  readonly #httpErrorService = inject(HttpErrorService);
  readonly #reviewService = inject(ReviewService);

  private productsUrl = 'api/products';

  private productSelectedSubject = new BehaviorSubject<number | undefined>(undefined);
  readonly productSelected$ = this.productSelectedSubject.asObservable();

  readonly products$ = this.#http.get<Product[]>(this.productsUrl).pipe(
    shareReplay(1),
    catchError(err => this.handleError(err))
  )

  // readonly product1$ = this.productSelected$.pipe(
  //   filter(Boolean),
  //   switchMap(id => {
  //     const productUrl = `${this.productsUrl}/${id}`;
  //     return this.#http.get<Product>(productUrl).pipe(
  //       switchMap(product => this.getProductWithReviews(product)),
  //       catchError(err => this.handleError(err))
  //     );
  //   }),
  // )

  readonly product$ = combineLatest([
    this.productSelected$,
    this.products$
  ]).pipe(
    map(([selectedProductId, products]) => products.find(product => product.id === selectedProductId)),
    filter(Boolean),
    switchMap(product => this.getProductWithReviews(product)),
    catchError(err => this.handleError(err))
  )

  productSelected(selectedProductId: number): void {
    this.productSelectedSubject.next(selectedProductId);
  }

  private getProductWithReviews(product: Product): Observable<Product> {
    if (product.hasReviews) {
      return this.#http.get<Review[]>(this.#reviewService.getReviewUrl(product.id)).pipe(
        map(reviews => ({...product, reviews} as Product)),
      )
    }
    return of(product);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    throw this.#httpErrorService.formatError(error);
  }
}

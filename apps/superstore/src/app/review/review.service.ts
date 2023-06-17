import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { BehaviorSubject, catchError, Observable, tap } from "rxjs";
import { CreateReviewDto, ReviewDto } from "@superstore/libs";
import { NotificationsService } from "../shared/notifications/notifications.service";

@Injectable({
    providedIn: 'root'
})
export class ReviewService {

    reviewUrl = environment.reviewUrl();
    reviews = new BehaviorSubject([] as ReviewDto[]);
    showModalAddReview: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private readonly http: HttpClient,
        private readonly notificationService: NotificationsService,
    ) {
    }

    addReview(review: CreateReviewDto): Observable<CreateReviewDto> {
        return this.http.post<CreateReviewDto>(this.reviewUrl, review)
            .pipe(
                tap(() => {
                    this.notificationService.showSuccessNotification('Success', 'Review added successfully');
                }),
                catchError((err) => {
                    this.notificationService.showErrorNotification('Error', err.message);
                    throw err;
                })
            );
    }

    getReviewsForProduct(productId: number): Observable<ReviewDto[]> {
        return this.http.get<ReviewDto[]>(`${ this.reviewUrl }/product/${ productId }`);
    }

    getReviewsForAllProducts(): Observable<ReviewDto[]> {
        return this.http.get<ReviewDto[]>(`${ this.reviewUrl }/product`);
    }

    deleteReview(reviewId: number): Observable<ReviewDto> {
        return this.http.delete<ReviewDto>(`${ this.reviewUrl }/${ reviewId }`)
            .pipe(
                tap(() => {
                    this.reviews.next(this.reviews.getValue().filter(review => review.id !== reviewId));
                    this.notificationService.showSuccessNotification('Success', 'Review deleted successfully');
                }),
                catchError((err) => {
                    this.notificationService.showErrorNotification('Error', err.message);
                    throw err;
                })
            );
    }

    openAddReviewModal() {
        this.showModalAddReview.next(true);
    }

    closeAddReviewModal() {
        this.showModalAddReview.next(false);
    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { PromotionDto } from '@superstore/interfaces';

@Injectable({
    providedIn: 'root'
})
export class PromotionService {

    promotionCodeUrl = environment.promotionCodeUrl();
    private promotionSubject: BehaviorSubject<PromotionDto[]> = new BehaviorSubject<PromotionDto[]>([]);
    promotions$ = this.promotionSubject.asObservable();

    constructor(
        private http: HttpClient,
        private readonly notificationService: NotificationsService,
    ) {
        this.getAllPromotions().subscribe();
    }

    getAllPromotions() {
        return this.http.get<PromotionDto[]>(this.promotionCodeUrl)
            .pipe(
                tap((promotions) => {
                    this.promotionSubject.next(promotions);
                })
            );
    }

    addPromotion(promotion: PromotionDto) {
        return this.http.post(`${ this.promotionCodeUrl }`, promotion)
            .pipe(
                tap((createdPromotion: PromotionDto) => {
                    this.notificationService.showSuccessNotification('Success', 'Promotion code added successfully');
                    this.promotionSubject.next([...this.promotionSubject.value, createdPromotion]);
                }),
                catchError(err => {
                    throw err;
                })
            );
    }

    checkPromotionCode(code: string) {
        return this.http.get(`${ this.promotionCodeUrl }/${ code }`)
            .pipe(
                tap((promotion: PromotionDto) => {
                    return this.usePromotionCode(promotion).subscribe();
                })
            )
    }

    usePromotionCode(promotion: PromotionDto) {
        return this.http.put(`${ this.promotionCodeUrl }/use-promotion/${ promotion.label }`, promotion);
    }

    updatePromotion(promotion: PromotionDto) {
        return this.http.put<PromotionDto>(`${ this.promotionCodeUrl }/${ promotion.id }`, promotion)
            .pipe(
                tap((updatedPromotion) => {
                    const promotions = this.promotionSubject.value.map(promotion =>
                        promotion.id === updatedPromotion.id ? updatedPromotion : promotion
                    );
                    this.promotionSubject.next(promotions);
                    this.notificationService.showSuccessNotification('Success', 'Promotion code updated successfully');
                }),
                catchError(err => {
                    throw err;
                })
            );
    }

    deletePromotion(promotion: PromotionDto) {
        return this.http.delete(`${ this.promotionCodeUrl }/${ promotion.id }`)
            .pipe(
                tap(() => {
                    const promotions = this.promotionSubject.value.filter((p) => p.id !== promotion.id);
                    this.promotionSubject.next(promotions);
                    this.notificationService.showSuccessNotification('Success', 'Promotion code deleted successfully');
                }),
                catchError(err => {
                    throw err;
                })
            );
    }
}

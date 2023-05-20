import { OrderState } from './state.dto';

export class CreateOrderDto {
    userId: number;
    state: OrderState;
    addressId: number;
    productsId: number[];
    deliveryMethod: string;
    paymentMethod: string;
    totalPrice: number;
}

export class DeliveryMethod {
    name: string;
    expectedDelivery: string;
    price: number;
}